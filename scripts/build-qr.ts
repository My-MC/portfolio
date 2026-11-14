import { mkdir } from 'node:fs/promises';
import QRCode from 'qrcode';
import { site } from '../src/data/site';

/**
 * 名刺用のQRコードを artifacts/ に生成する。
 * 例: SITE_URL=https://example.com bun run qr
 */
const url = `${site.url}/`;
if (url.includes('localhost')) {
  console.error(
    'SITE_URLを指定してください（例: SITE_URL=https://... bun run qr）',
  );
  process.exit(1);
}
await mkdir('artifacts', { recursive: true });
const options = { errorCorrectionLevel: 'M' as const, margin: 2 };
await QRCode.toFile('artifacts/qr.svg', url, { ...options, type: 'svg' });
await QRCode.toFile('artifacts/qr.png', url, { ...options, width: 1200 });
console.log(
  `QRコードを生成しました: ${url} -> artifacts/qr.svg, artifacts/qr.png`,
);
