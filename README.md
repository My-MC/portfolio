# My-MC Portfolio

My（[@My-MC](https://github.com/My-MC)）のポートフォリオ兼ブログです。[ALG公式サイト](https://github.com/ALG-SIT/website)と同じ構成（Astro + Tailwind CSS v4 + MDX + Pagefind + Biome）で、JavaScriptランタイムにBunを使い、Cloudflare Workers（Static Assets）で静的配信します。

## 開発

Node.js **24.21.0** と Bun **1.4.4** を使用します。

```sh
bun ci
bun run dev
```

`http://localhost:4321/` を開きます。依存関係を変更したら `bun install` で `bun.lock` を更新してコミットします。

| コマンド                          | 内容                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------- |
| `bun run dev`                     | ローカル開発（下書き・未来日付の記事も表示）                                     |
| `bun run build`                   | 静的生成 → 日本語フォントのサブセット化 → 再生成 → 検索インデックス → 成果物検証 |
| `bun run preview:cloudflare`      | ビルド済み `dist/` をWranglerで配信（ポート8787）                                |
| `bun run check`                   | Astro・TypeScriptの型検査                                                        |
| `bun run lint` / `bun run format` | Biome（MDXはPrettier + markdownlint）                                            |
| `bun test`                        | 単体テスト                                                                       |
| `bun run assets:build`            | favicon・OGP画像を再生成（`public/` にコミット）                                 |
| `SITE_URL=https://... bun run qr` | 名刺用QRコードを `artifacts/qr.svg`・`qr.png` に生成                             |

## 書き方

- 記事：`src/content/blog/<slug>.md(x)`。雛形は [docs/post-template.md](docs/post-template.md)
- プロジェクト：`src/content/projects/<slug>.md`
- プロフィール・SNS・スキル・所属：`src/data/site.ts`
- タグ・カテゴリー：`src/data/tags.ts`

`draft: true` や未来の `publishedAt` は本番のHTML・検索・RSS・サイトマップから除外されます。

## 公開

[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) を参照してください。

## ライセンス

ソースコードは [MIT License](LICENSE) です。ただし、次のものはMITの対象外です。

- `src/content/` の記事・プロジェクト紹介の文章、`src/data/site.ts` のプロフィール情報、`public/og.png` などの個人に関するコンテンツ：著作権は作者（My-MC）に帰属します。
- `src/assets/lumin/` の画面写真・図：ALG（[ALG-SIT/Lumin](https://github.com/ALG-SIT/Lumin)）の素材です。
- フォント（Noto Sans JP・Cascadia Mono）：SIL Open Font License 1.1。ライセンス文は `public/fonts/` と `src/assets/lumin/OFL.txt` にあります。
