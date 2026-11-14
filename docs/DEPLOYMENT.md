# Cloudflare Workers への公開

ALG公式サイトと同じく、Workers Builds（GitHub連携）で `main` を本番公開し、それ以外のブランチをプレビューにします。Worker スクリプトやアダプターは使わず、`wrangler.jsonc` の `assets.directory: ./dist` を静的配信するだけです。

## Workers Builds の設定

Cloudflare ダッシュボード → Workers & Pages → Create → Import a repository で、このリポジトリを選びます。

| 設定                                 | 値                                                     |
| ------------------------------------ | ------------------------------------------------------ |
| Worker名                             | `portfolio`（`wrangler.jsonc` の `name` と一致させる） |
| 本番ブランチ                         | `main`                                                 |
| Build command                        | `bun ci && bun run build:cloudflare`                   |
| Deploy command                       | `bunx wrangler deploy`                                 |
| Non-production branch deploy command | `bunx wrangler preview`                                |

### ビルド環境変数

| 変数                       | 値                                                                           |
| -------------------------- | ---------------------------------------------------------------------------- |
| `BUN_VERSION`              | `1.4.4`                                                                      |
| `NODE_VERSION`             | `24.21.0`                                                                    |
| `SKIP_DEPENDENCY_INSTALL`  | `1`                                                                          |
| `ASTRO_TELEMETRY_DISABLED` | `1`                                                                          |
| `SITE_URL`                 | 公開URL（例：`https://portfolio.<account>.workers.dev`、末尾スラッシュなし） |
| `SITE_RELEASE`             | `1`（mainで公開検証を有効化）                                                |

`SITE_URL` は canonical・OGP・RSS・サイトマップに使います。`SITE_RELEASE=1` のとき、`SITE_URL` が https で設定されていないとビルドが失敗します。`main` 以外のブランチは自動的に `noindex` と robots 全拒否になります。

## 独自ドメインにする場合

Workers の Settings → Domains & Routes で Custom Domain を追加し、`SITE_URL` を新しいURLに変えて再ビルドします。名刺のQRコードは `SITE_URL=... bun run qr` で作り直してください。

## 手動公開（緊急時）

```sh
bunx wrangler login
WORKERS_CI_BRANCH=main SITE_RELEASE=1 SITE_URL=https://... bun run build:cloudflare
bunx wrangler deploy
```
