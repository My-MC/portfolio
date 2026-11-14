import { readdir, readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { slugPattern } from './publishing';

/** slugの形式・重複とFrontmatterの有無を、Astroの読み込み前に検査する。 */
export async function validateSources(root = 'src/content') {
  for (const collection of ['blog', 'projects']) {
    const filenames = await readdir(`${root}/${collection}`);
    const slugs = new Set<string>();
    for (const filename of filenames.filter((file) => /\.mdx?$/.test(file))) {
      const slug = filename.replace(/\.mdx?$/, '');
      if (!slugPattern.test(slug) || slugs.has(slug))
        throw new Error(`不正または重複したslug: ${collection}/${filename}`);
      slugs.add(slug);
      const raw = await readFile(`${root}/${collection}/${filename}`, 'utf8');
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!match || !parse(match[1]))
        throw new Error(`Frontmatterがありません: ${collection}/${filename}`);
    }
  }
}
