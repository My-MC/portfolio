import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { profile } from '../src/data/site';

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

const escapeXml = (value: string) =>
  value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fontFamily = "'Noto Sans CJK JP','Noto Sans JP',sans-serif";
const mono = "'Cascadia Mono','DejaVu Sans Mono',monospace";
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="g" cx="0.85" cy="0.15" r="0.7">
      <stop offset="0" stop-color="#5fe3c8" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#5fe3c8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0c1012"/>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="64" y="64" width="1072" height="502" rx="24" fill="#12181b" stroke="#26343a" stroke-width="2"/>
  <circle cx="104" cy="104" r="9" fill="#ff5f57"/>
  <circle cx="134" cy="104" r="9" fill="#febc2e"/>
  <circle cx="164" cy="104" r="9" fill="#28c840"/>
  <text x="112" y="214" font-family="${mono}" font-size="34" fill="#5fe3c8">$ <tspan fill="#d7e3e0">whoami</tspan></text>
  <text x="112" y="312" font-family="${fontFamily}" font-size="88" font-weight="700" fill="#e5ecea">${escapeXml(profile.displayName)} <tspan font-family="${mono}" font-size="44" font-weight="400" fill="#9aa9a6">@${escapeXml(profile.handle)}</tspan></text>
  <text x="112" y="390" font-family="${fontFamily}" font-size="34" fill="#f5b84a">${escapeXml(profile.tagline)}</text>
  <text x="112" y="474" font-family="${fontFamily}" font-size="30" fill="#9aa9a6">ネットワーク・サーバー・ものづくり / Portfolio &amp; Blog</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og.png');
console.log('favicon・OGP画像を生成しました');
