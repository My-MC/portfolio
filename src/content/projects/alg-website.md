---

title: ALG公式サイト
description: 芝浦工業大学のAI・GPUサークル「ALG（AI Love GPU）」の公式サイト。設計から実装・公開までを担当。
status: completed
technologies: [Astro, Tailwind CSS, Bun, Pagefind, Cloudflare Workers]
tags: [web]
role: 設計・実装
repositoryUrl: https://github.com/ALG-SIT/website
websiteUrl: https://alg-sit.club/
featured: false
order: 3
---

## 概要

所属しているサークル ALG（AI Love GPU）の公式サイトです。団体紹介、技術記事、活動報告、プロジェクト紹介を掲載しています。

## 技術的なポイント

- Astroによる完全な静的生成と、Cloudflare Workers Static Assetsでの配信
- 日本語フォントを公開HTMLで使われる文字だけにサブセット化し、外部フォントサービスに依存しない
- Pagefindによる日本語の全文検索
- Workers Buildsでmainは本番公開、ブランチはnoindex付きプレビュー
- Biome・型検査・単体テスト・ブラウザテストをGitHub Actionsで実行
