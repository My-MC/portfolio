/**
 * サイト全体の設定。公開URLはビルド環境変数 SITE_URL で上書きできる
 * （Workers Buildsのビルド変数に設定する。末尾スラッシュなし）。
 */
const envUrl =
  typeof process !== 'undefined' ? process.env.SITE_URL?.trim() : undefined;

export const site = {
  /** サイト名（ヘッダー・タイトル末尾） */
  name: 'My-MC',
  url: (envUrl || 'https://my-mc.dev').replace(/\/+$/, ''),
  description:
    'My（My-MC）のポートフォリオ兼ブログ。ネットワーク、Linuxサーバー運用、自宅ラボ、ソフトウェア開発について書いています。',
  /** true の間は本番でも検索エンジンに載せない */
  preview: false,
  /** このサイトのソースコード（Links・Aboutに表示） */
  repository: 'https://github.com/My-MC/portfolio',
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
  bio: 'ネットワークとサーバーが好きな学生です。自宅ラボでProxmox VE・Incus・VyOSを触っています。SDCCの皆さんのお力添えをいただき、BGPも勉強させてもらっています。無線研究部・しばよこ・ALG・SIGINTに所属し、電波からAI、Webまで「動くもの」をつくって試すのが好きです。',
  interests: [
    'ネットワーク・BGP',
    '自宅サーバー',
    '無線・電波',
    'AI・GPU',
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
    items: ['BGP', 'IPv6', 'GREトンネル'],
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
    text: '70年近い歴史を持つ技術系の部。アマチュア無線で日本中と交信するほか、音響・照明・プログラミング、部室のラックサーバーやネットワークまで、電波もインフラも実際に手を動かして学べる場所です。',
    url: 'https://ja1yxp.radio/',
  },
  {
    name: 'しばよこ',
    note: 'エンジニア・デザイナーサークル',
    interests: ['Web', 'チーム開発', 'ハッカソン'],
    text: 'エンジニアとデザイナーが集まる芝浦工大のサークル。技術とデザインを掛け合わせて、人の心を動かすものづくりを目指す姿勢に惹かれて参加しています。',
    url: 'https://shibayoko.com/',
  },
  {
    name: 'ALG',
    note: 'AI Love GPU',
    interests: ['AI', 'オンデバイスAI', 'GPU基盤', 'Web'],
    text: 'AIとGPUの学生団体。公認化を目指して活動中で、共有GPU資源の運用やAI駆動開発に取り組んでいます。メンバーのチーム「Luminous Studying」で開発した学習支援アプリLuminがSBMC 2026で銅賞を受賞しました。公式サイトの設計・実装は自分が担当しています。',
    url: 'https://alg-sit.club/',
  },
  {
    name: 'SIGINT',
    note: 'ネットワーク研究会',
    interests: [
      'ネットワーク',
      'ルーター・スイッチ',
      'トラブルシューティング',
      'AS運用',
    ],
    text: '芝浦工大のネットワーク研究会。実機のスイッチ・ルーターに触れて学び、部室ネットワークの設計・運用を進めつつ、将来的にはイベントのWi-Fi支援やAS運用・ピアリングを目標にしています。チームでICTSC（ICTトラブルシューティングコンテスト）2026の一次予選を突破しました。自宅ラボで試していることを、仲間と一緒に深められる場所です。',
    url: 'https://sigint179.net/',
  },
];

export interface Award {
  date: string;
  title: string;
  result: string;
  /** neofetch・curl名刺用の短い表記 */
  short: string;
  /** トップの帯に出すリンク文言 */
  linkLabel: string;
  detail: string;
  /** サイト内のプロジェクトページ */
  project?: string;
  url?: string;
}

export const awards: Award[] = [
  {
    date: '2026-09-27',
    title:
      '第11回 芝浦ビジネスモデルコンペティション（SBMC）ビジネスアイデア部門',
    result: '銅賞',
    short: 'SBMC 2026 銅賞（Lumin）',
    linkLabel: 'Lumin',
    detail:
      'ALGメンバーのチーム「Luminous Studying」として、端末内AIで学習を支援するアプリ「Lumin」を提案。',
    project: '/projects/lumin/',
    url: 'https://www.shibaura-it.ac.jp/headline/detail/20260927_7070_2.html',
  },
  {
    date: '2026-09-19',
    title: 'ICTトラブルシューティングコンテスト（ICTSC）一次予選',
    result: '一次予選突破',
    short: 'ICTSC 一次予選突破（SIGINT）',
    linkLabel: 'SIGINTの記事',
    detail:
      'SIGINTのチームとして参加。実際のネットワーク・サーバー環境で起きるトラブルを制限時間内に解決するコンテストで、47チーム中15位となり二次予選に進出。',
    url: 'https://sigint179.net/activities/ictsc-2026-yosen',
  },
];
