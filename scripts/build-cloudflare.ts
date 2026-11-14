import { previewUrl } from './preview-target';

const branch = process.env.WORKERS_CI_BRANCH?.trim();

if (!branch) {
  console.error('Workers BuildsにはWORKERS_CI_BRANCHが必要です');
  process.exit(1);
}

const production = branch === 'main';
// プレビューは自分の Preview URL を正規URLとして埋め込む（curl名刺やcanonicalのため）
const siteUrl = production
  ? process.env.SITE_URL
  : process.env.PREVIEW_SITE_URL || previewUrl(branch);
if (!production) console.log(`プレビューのURL: ${siteUrl}`);

const child = Bun.spawn([process.execPath, 'run', 'build'], {
  env: {
    ...process.env,
    WORKERS_CI_BRANCH: branch,
    SITE_RELEASE: production ? process.env.SITE_RELEASE : '0',
    ...(siteUrl ? { SITE_URL: siteUrl } : {}),
  },
  stdin: 'inherit',
  stdout: 'inherit',
  stderr: 'inherit',
});

process.exit(await child.exited);
