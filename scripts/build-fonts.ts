import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { load } from 'cheerio';
import subsetFont from 'subset-font';

/**
 * 日本語フォントを使用文字だけにサブセット化して .font-trial/ に置く。
 * --built なしは src/ の文字、--built はビルド済み dist/ のHTMLの文字を使う。
 */
const built = process.argv.includes('--built');
async function filesIn(directory: string): Promise<string[]> {
  return (
    await Promise.all(
      (
        await readdir(directory, { withFileTypes: true })
      ).map((entry) =>
        entry.isDirectory()
          ? filesIn(join(directory, entry.name))
          : [join(directory, entry.name)],
      ),
    )
  ).flat();
}
const sources = (await filesIn(built ? 'dist' : 'src')).filter((file) =>
  built ? file.endsWith('.html') : /\.(astro|mdx?|ts|json)$/.test(file),
);
let text = '';
for (const file of sources) {
  const source = await readFile(file, 'utf8');
  if (built) {
    const $ = load(source);
    $('script,style').remove();
    text += $('body').text();
    text += $('title').text();
  } else text += source;
}
// 検索結果などJSで表示するUI文字列も含める。
text += await readFile('src/lib/browser.ts', 'utf8');
const characters = [...new Set([...text])].sort().join('');
const destination = '.font-trial';
await mkdir(destination, { recursive: true });
for (const weight of [400, 700]) {
  const font = await readFile(
    resolve(
      `node_modules/@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-${weight}-normal.woff2`,
    ),
  );
  const subset = await subsetFont(font, characters, { targetFormat: 'woff2' });
  await writeFile(join(destination, `sans-jp-${weight}.woff2`), subset);
  console.log(
    `日本語フォント${weight}: ${Math.round(subset.length / 1024)} KiB (${characters.length}文字)`,
  );
  // 等幅（英数字）はCascadia Monoのlatinサブセットをそのまま使う。
  await copyFile(
    resolve(
      `node_modules/@fontsource/cascadia-mono/files/cascadia-mono-latin-${weight}-normal.woff2`,
    ),
    join(destination, `mono-${weight}.woff2`),
  );
}
