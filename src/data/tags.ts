export const tags = {
  network: 'ネットワーク',
  infra: 'インフラ',
  homelab: '自宅ラボ',
  linux: 'Linux',
  web: 'Web',
  rust: 'Rust',
  python: 'Python',
  font: 'フォント',
  audio: 'オーディオ',
  ai: 'AI',
  event: 'イベント',
} as const;
export type TagId = keyof typeof tags;
export const categories = {
  tech: '技術',
  event: 'イベント',
  diary: '雑記',
} as const;
export const statuses = {
  planning: '企画中',
  active: '開発中',
  completed: '完成',
  archived: 'アーカイブ',
} as const;
