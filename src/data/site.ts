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
  tagline: '芝浦工業大学 システム理工学部 情報課程 メディアコース',
  school: {
    university: '芝浦工業大学',
    faculty: 'システム理工学部 情報課程',
    course: 'メディアコース',
  },
  bio: '芝浦工業大学 システム理工学部 情報課程 メディアコースの学生です。ネットワークとサーバーが好きで、自宅ラボでProxmox VE・Incus・VyOSを触りながら、SDCCでAS番号をもらってBGPを勉強しています。無線研究部・しばよこ・ALG・SIGINTに所属し、電波からAI、Webまで「動くもの」をつくって試すのが好きです。',
  interests: [
    'ネットワーク / BGP',
    '自宅サーバー',
    '無線・電波',
    'AI / GPU',
    'ものづくり',
    'フォント・オーディオ',
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
  { label: 'X', id: '@imymemine256', url: 'https://x.com/imymemine256' },
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

export interface Activity {
  name: string;
  /** 正式名称など補足 */
  note?: string;
  /** その団体で自分が惹かれているもの（タグとして表示） */
  interests: string[];
  text?: string;
  url?: string;
}

/** 所属団体。text は「なぜそこにいるか」が伝わるように書く。 */
export const activities: Activity[] = [
  {
    name: '文化会 無線研究部',
    note: 'JA1YXP',
    interests: ['アマチュア無線', 'サーバー運用', 'ネットワーク'],
    text: '創部70年近い技術系の部活。電波で日本中と交信するアマチュア無線から、部室のラックサーバーやネットワークまで、「波」と「インフラ」を実際に手で触れる場所として活動しています。',
    url: 'https://ja1yxp.radio/',
  },
  {
    name: 'しばよこ',
    note: 'エンジニア・デザイナーサークル',
    interests: ['Web', 'チーム開発', 'ハッカソン'],
    text: 'エンジニアとデザイナーが共創する芝浦工大のサークル。技術だけでなく「人に届くデザイン」と組み合わせたものづくりに惹かれて参加しています。',
    url: 'https://shibayoko.com/',
  },
  {
    name: 'ALG',
    note: 'AI Love GPU',
    interests: ['AI', 'GPU基盤', 'Web'],
    text: 'AIとGPUのサークル。公認化を目指して活動中で、共有GPU資源の運用やAI駆動開発に取り組んでいます。公式サイトの設計・実装も担当しました。',
    url: 'https://alg-sit.club/',
  },
  {
    name: 'SIGINT',
    // TODO: 活動内容が決まったら interests と text を書く（空なら名前だけ表示）
    interests: [],
    text: '',
  },
];
