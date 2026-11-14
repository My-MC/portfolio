import { readdir, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { load } from 'cheerio';
import { site } from '../src/data/site';
import { isPreview } from '../src/lib/seo';

/** ビルド成果物の最低限の品質と公開設定を検査する。 */
const root = resolve('dist');
const failures: string[] = [];
const assert = (condition: unknown, message: string) => {
  if (!condition) failures.push(message);
};
async function filesIn(dir: string): Promise<string[]> {
  return (
    await Promise.all(
      (
        await readdir(dir, { withFileTypes: true })
      ).map((entry) =>
        entry.isDirectory()
          ? filesIn(join(dir, entry.name))
          : [join(dir, entry.name)],
      ),
    )
  ).flat();
}
const files = await filesIn(root);
const rel = new Set(files.map((file) => relative(root, file)));
for (const path of [
  'index.html',
  'about/index.html',
  'blog/index.html',
  'projects/index.html',
  'links/index.html',
  '404.html',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'pagefind/pagefind.js',
  'og.png',
  'favicon.svg',
  'favicon-96x96.png',
  'apple-touch-icon.png',
  '_headers',
])
  assert(rel.has(path), `必要な成果物がありません: ${path}`);

const branch = process.env.WORKERS_CI_BRANCH;
const preview = isPreview(site.preview, branch);
const release = process.env.SITE_RELEASE === '1' && !preview;
const titles = new Map<string, string>();
for (const file of files.filter((path) => path.endsWith('.html'))) {
  const name = relative(root, file);
  const $ = load(await readFile(file, 'utf8'));
  const title = $('title').text().trim();
  assert(title, `titleがありません: ${name}`);
  if (titles.has(title) && name !== '404.html')
    failures.push(`titleが重複しています: ${name} / ${titles.get(title)}`);
  titles.set(title, name);
  assert(
    $('meta[name="description"]').attr('content')?.trim(),
    `descriptionがありません: ${name}`,
  );
  assert($('h1').length === 1, `h1は1つにしてください: ${name}`);
  const canonical = $('link[rel="canonical"]').attr('href') ?? '';
  assert(
    canonical.startsWith(site.url),
    `canonicalがサイトURLと一致しません: ${name}`,
  );
  const robots = $('meta[name="robots"]').attr('content') ?? '';
  if (preview)
    assert(
      robots.includes('noindex'),
      `プレビューにnoindexがありません: ${name}`,
    );
  else if (name !== '404.html')
    assert(!robots.includes('noindex'), `本番でnoindexになっています: ${name}`);
  $('img').each((_, img) => {
    assert($(img).attr('alt') !== undefined, `imgにaltがありません: ${name}`);
  });
}
const robotsTxt = await readFile(join(root, 'robots.txt'), 'utf8');
assert(
  preview ? robotsTxt.includes('Disallow: /') : robotsTxt.includes('Allow: /'),
  'robots.txtの公開設定がビルド種別と一致しません',
);
if (release) {
  assert(
    /^https:\/\//.test(site.url) && !site.url.includes('localhost'),
    '本番ビルドにはSITE_URL（https://...）の設定が必要です',
  );
}
if (failures.length) {
  console.error(`成果物の検証に失敗しました（${failures.length}件）`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(
  `成果物の検証に成功しました（HTML ${titles.size}件、${preview ? 'プレビュー' : '公開'}設定、URL ${site.url}）`,
);
