---

title: ポートフォリオサイトを作りました
description: 自鯖缶に向けて、ポートフォリオ兼ブログを作りました。Astro・Bun・Cloudflare Workersで作った構成を紹介します。
publishedAt: 2026-11-14T10:00:00+09:00
category: tech
tags: [web, event]
---

自鯖缶に参加するにあたって名刺を作ることにしたので、名刺に載せるためのポートフォリオ兼ブログを作りました。

## 構成

以前作ったサークルの[ALG公式サイト](https://alg-sit.club/)と同じ構成をベースにしています。

| 役割                 | 使ったもの                            |
| -------------------- | ------------------------------------- |
| サイト生成           | Astro（完全な静的生成）               |
| スタイル             | Tailwind CSS v4                       |
| JavaScriptランタイム | Bun                                   |
| 記事                 | Markdown / MDX（Content Collections） |
| 全文検索             | Pagefind                              |
| 配信                 | Cloudflare Workers（Static Assets）   |
| Lint / Format        | Biome                                 |

## 工夫したところ

### 日本語フォントのサブセット化

日本語のWebフォントはそのままだと数MBになります。そこで一度サイトをビルドし、生成されたHTMLで実際に使われている文字だけを抜き出してフォントをサブセット化し、もう一度ビルドしています。外部のフォントサービスに頼らず、自分のサイトだけで配信できます。

```sh
bun run build
```

### Workers Buildsでの公開

GitHubにpushすると、Cloudflare Workers Buildsがビルドして公開します。`main`以外のブランチはプレビューURLになり、検索エンジンに載らないよう`noindex`を付けています。

## これから

自宅ラボやSDCCでのBGPの練習など、試したことを少しずつ書いていく予定です。
