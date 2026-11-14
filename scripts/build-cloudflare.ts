import { previewUrl } from './preview-target';

const branch = process.env.WORKERS_CI_BRANCH?.trim();

if (!branch) {
  console.error('Workers BuildsにはWORKERS_CI_BRANCHが必要です');
  process.exit(1);
}

const production = branch === 'main';
// プレビューは自分の Preview URL を正規URLとして埋め込む（curl名刺やcanonicalのため）
// 本番の公開URLは src/data/site.ts の既定値（https://my-mc.dev）に固定する。
// ダッシュボードに古い SITE_URL が残っていても本番に混ざらないよう、明示的に消す。
const siteUrl = production
  ? undefined
  : process.env.PREVIEW_SITE_URL || previewUrl(branch);
if (production && process.env.SITE_URL)
  console.warn(
    `本番ビルドでは SITE_URL（${process.env.SITE_URL}）を無視します。不要なビルド変数なので削除してください。`,
  );
if (!production) console.log(`プレビューのURL: ${siteUrl}`);

const child = Bun.spawn([process.execPath, 'run', 'build'], {
  env: {
    ...process.env,
    WORKERS_CI_BRANCH: branch,
    SITE_RELEASE: production ? process.env.SITE_RELEASE : '0',
    SITE_URL: siteUrl ?? '',
  },
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
});

process.exit(await child.exited);
