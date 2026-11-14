import { previewName, previewUrl } from './preview-target';

/** ブランチ名から決めた名前で Preview を作る（ビルド時に埋め込んだURLと一致させる）。 */
const branch = process.env.WORKERS_CI_BRANCH?.trim();
if (!branch) {
  console.error('WORKERS_CI_BRANCHが必要です');
  process.exit(1);
}
console.log(`Preview: ${previewName(branch)} -> ${previewUrl(branch)}`);
const child = Bun.spawn(
  [
    process.execPath,
    'x',
    'wrangler',
    'preview',
    '--name',
    previewName(branch),
    ...process.argv.slice(2),
  ],
  { stdin: 'inherit', stdout: 'inherit', stderr: 'inherit' },
);
process.exit(await child.exited);
