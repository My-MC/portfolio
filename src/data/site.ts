/**
 * サイト全体の設定。公開URLはビルド環境変数 SITE_URL で上書きできる
 * （Workers Buildsのビルド変数に設定する。末尾スラッシュなし）。
 */
const envUrl =
  typeof process !== 'undefined' ? process.env.SITE_URL?.trim() : undefined;

export const site = {
  /** サイト名（ヘッダー・タイトル末尾） */
  name: 'My-MC',
  url: (envUrl || 'http://localhost:4321').replace(/\/+$/, ''),
  description:
    'My（My-MC）のポートフォリオ兼ブログ。ネットワーク、Linuxサーバー運用、自宅ラボ、ソフトウェア開発について書いています。',
  /** true の間は本番でも検索エンジンに載せない */
  preview: false,
  /** リポジトリを公開したらURLを入れるとLinksに表示される */
  repository: '',
  /** 名刺から来た人向けのあいさつ（不要になったら null） */
  welcome:
    '自鯖缶で名刺を受け取ってくださった方、ありがとうございます！気軽に声をかけてください。' as
      | string
      | null,
};

export const profile = {
  displayName: 'My',
  handle: 'My-MC',
  /** 1行の肩書き */
  tagline: '芝浦工業大学 / ALG（AI Love GPU）',
  bio: 'ネットワークとLinuxサーバーが好きな大学生です。自宅ラボでProxmox VE・Incus・VyOSを触りながら、SDCCでAS番号をもらってBGPを勉強しています。フォントやオーディオプラグインなど、趣味のソフトウェアも作っています。',
  interests: [
    'ネットワーク / BGP',
    'Linuxサーバー運用',
    '自宅ラボ・仮想化',
    'ソフトウェア開発',
    'フォント',
    'オーディオ',
  ],
};

export interface SocialLink {
  label: string;
  /** 表示用のID */
  id: string;
  url: string;
}

/** 連絡先・SNS。確認済みのものだけを載せる。 */
export const social: SocialLink[] = [
  { label: 'GitHub', id: '@My-MC', url: 'https://github.com/My-MC' },
];

export const navigation = [
  { href: '/about/', label: 'About' },
  { href: '/projects/', label: 'Projects' },
  { href: '/blog/', label: 'Blog' },
  { href: '/links/', label: 'Links' },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Infrastructure',
    items: [
      'Debian / Linux',
      'Proxmox VE',
      'Incus',
      'VyOS',
      'NEC IX',
      'nftables',
      'Tailscale',
      'Prometheus / Alertmanager',
    ],
  },
  {
    group: 'Network',
    items: ['BGP', 'IPv6', 'GREトンネル', 'SDCC'],
  },
  {
    group: 'Development',
    items: ['Rust', 'Python', 'TypeScript', 'Astro', 'Bun', 'Tauri'],
  },
  {
    group: 'Delivery',
    items: ['GitHub Actions', 'Cloudflare Workers', 'Docker'],
  },
];

export const activities: { title: string; text: string; url?: string }[] = [
  {
    title: 'ALG（AI Love GPU）',
    text: '芝浦工業大学のAI・GPUサークル。公認化を目指して活動中で、公式サイトの設計・実装を担当しました。',
    url: 'https://alg-sit.club/',
  },
  {
    title: 'SDCC',
    text: '仮想ネットワーク・仮想インフラのコミュニティ。AS番号やIPアドレスの払い出しを受け、BGP接続を練習しています。',
  },
  {
    title: '自宅ラボ',
    text: 'Proxmox VE上でIncusやVyOSを使った実験ネットワークを組み、監視とアラート通知まで自分で運用しています。',
  },
];
