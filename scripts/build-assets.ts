import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { ogHash, ogHashFile, ogSvg } from './og-image';

/** favicon・Apple Touch Icon・OGP画像をSVGから生成する（生成物はコミットする）。 */
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <title>My-MC</title>
  <rect width="64" height="64" rx="14" fill="#0f1518"/>
  <path d="M16 22l10 10-10 10" fill="none" stroke="#5fe3c8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M31 43h17" stroke="#f5b84a" stroke-width="5" stroke-linecap="round"/>
</svg>`;
await writeFile('public/favicon.svg', `${icon}\n`);
await sharp(Buffer.from(icon))
  .resize(96, 96)
  .png()
  .toFile('public/favicon-96x96.png');
await sharp(Buffer.from(icon))
  .resize(180, 180)
  .flatten({ background: '#0f1518' })
  .png()
  .toFile('public/apple-touch-icon.png');

await sharp(Buffer.from(ogSvg())).png().toFile('public/og.png');
await writeFile(ogHashFile, `${ogHash()}\n`);
console.log('favicon・OGP画像を生成しました');
