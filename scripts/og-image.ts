import { createHash } from 'node:crypto';
import { productionUrl, profile } from '../src/data/site';

/**
 * OGP画像のSVG。public/og.png は日本語フォントが必要なためローカルで生成してコミットし、
 * 元になった SVG のハッシュを scripts/og-image.sha256 に記録する（verify-output が照合する）。
 */
const escapeXml = (value: string) =>
  value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
const fontFamily = "'Noto Sans CJK JP','Noto Sans JP',sans-serif";
const mono = "'Cascadia Mono','DejaVu Sans Mono',monospace";
export function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
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
  <text x="112" y="474" font-family="${fontFamily}" font-size="30" fill="#9aa9a6">電波とネットワークと、ものづくり。 / Portfolio &amp; Blog</text>
  <text x="1088" y="530" text-anchor="end" font-family="${mono}" font-size="28" fill="#5fe3c8">${escapeXml(new URL(productionUrl).host)}</text>
</svg>`;
}

export const ogHashFile = 'scripts/og-image.sha256';
export function ogHash() {
  return createHash('sha256').update(ogSvg()).digest('hex');
}
