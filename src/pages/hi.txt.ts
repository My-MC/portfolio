import { activities, profile, site, social } from '../data/site';

/**
 * `curl -sL <site>/hi` で表示する名刺（ANSIカラー）。
 * /hi は public/_redirects で /hi.txt に内部転送する。
 */
const esc = (code: string) => `\x1b[${code}m`;
const reset = esc('0');
const bold = (s: string) => `${esc('1')}${s}${reset}`;
const cyan = (s: string) => `${esc('36')}${s}${reset}`;
const yellow = (s: string) => `${esc('33')}${s}${reset}`;
const dim = (s: string) => `${esc('2')}${s}${reset}`;

export function GET() {
  const art = [
    '     \\ | /',
    '      \\|/',
    '  .----+----.',
    '  | o ===== |',
    '  |---------|',
    '  | o ===== |',
    "  '---------'",
  ];
  const label = (key: string) => cyan(key.padEnd(8));
  const lines = [
    '',
    ...art.map((line) => `  ${cyan(line)}`),
    '',
    `  ${bold(`${profile.displayName} (@${profile.handle})`)}`,
    `  ${dim('-'.repeat(32))}`,
    `  ${label('School')}${profile.school.university}`,
    `  ${label('Faculty')}${profile.school.faculty}`,
    `  ${label('Course')}${profile.school.course}`,
    `  ${label('Clubs')}${activities.map((a) => a.name.replace('文化会 ', '')).join(' / ')}`,
    `  ${label('Likes')}${profile.interests.join(', ')}`,
    '',
    ...social.map((item) => `  ${label(item.label)}${item.url}`),
    `  ${label('Web')}${site.url}/`,
    '',
    `  ${yellow('名刺を受け取ってくれてありがとう！ 気軽に話しかけてください。')}`,
    `  ${dim('(this card is served as a static file from Cloudflare Workers)')}`,
    '',
  ];
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
