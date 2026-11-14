# Cloudflare Workers への公開

Workers Builds（GitHub連携）で `main` を本番 `https://my-mc.dev/` に公開し、それ以外のブランチを `*-portfolio.my-mc.workers.dev` のプレビューにします。Worker スクリプトやアダプターは使わず、`wrangler.jsonc` の `assets.directory: ./dist` を静的配信するだけです。

| 種類         | URL                                                    | 作られ方                                                          |
| ------------ | ------------------------------------------------------ | ----------------------------------------------------------------- |
| 本番         | `https://my-mc.dev/`                                   | `main` への push → `wrangler deploy`（`routes` の Custom Domain） |
| プレビュー   | `https://<branch>-portfolio.my-mc.workers.dev/`        | `main` 以外への push → `bun run preview:deploy`                   |
| 個別デプロイ | `https://<deployment-id>-portfolio.my-mc.workers.dev/` | 各プレビューの固定URL                                             |

## 1. 事前準備（初回のみ）

1. **workers.dev サブドメイン**：Workers & Pages → 右側の「Account details」→ Subdomain を `my-mc` にする（`my-mc.workers.dev`）。
2. **my-mc.dev を Cloudflare のゾーンにする**：Cloudflare Registrar で取得するか、他社で取得済みならネームサーバーを Cloudflare に向けて「Active」にする。
3. 既存の `my-mc.dev` の A / AAAA / CNAME レコードがあれば削除する（Custom Domain が自動で作るため、残っていると追加に失敗する）。

## 2. Workers Builds の設定

Workers & Pages → Create → Import a repository で `My-MC/portfolio` を選びます。

| 設定                                 | 値                                                     |
| ------------------------------------ | ------------------------------------------------------ |
| Worker名                             | `portfolio`（`wrangler.jsonc` の `name` と一致させる） |
| 本番ブランチ                         | `main`                                                 |
| Build command                        | `bun ci && bun run build:cloudflare`                   |
| Deploy command                       | `bunx wrangler deploy`                                 |
| Non-production branch builds         | 有効                                                   |
| Non-production branch deploy command | `bun run preview:deploy`                               |

### ビルド環境変数

| 変数                       | 値                            |
| -------------------------- | ----------------------------- |
| `BUN_VERSION`              | `1.4.4`                       |
| `NODE_VERSION`             | `24.21.0`                     |
| `SKIP_DEPENDENCY_INSTALL`  | `1`                           |
| `ASTRO_TELEMETRY_DISABLED` | `1`                           |
| `SITE_RELEASE`             | `1`（mainで公開検証を有効化） |

公開URLは `src/data/site.ts` の既定値 `https://my-mc.dev` に固定です。**ビルド変数に `SITE_URL` は設定しないでください**（本番ビルドでは無視し、警告を出します。本番ドメインを変えるときは `site.ts` を変更します）。canonical・OGP・RSS・サイトマップ・`/hi` はすべてこのURLになります。

`main` 以外のブランチは自動的に `noindex` と robots 全拒否でビルドされ、workers.dev のプレビューには Cloudflare も `X-Robots-Tag: noindex` を付けます。

プレビューでは、ブランチ名から Preview 名（例：`feature/Add_X` → `feature-add-x`）とURL `https://feature-add-x-portfolio.my-mc.workers.dev` を `scripts/preview-target.ts` の同じ規則で決め、ビルド（canonical・OGP・`/hi` に埋め込むURL）とデプロイ（`wrangler preview --name`）の両方に使います。そのためプレビュー内のURLも本番ではなく、そのプレビュー自身を指します。トップのcurlコマンドの表示は、さらに閲覧中のホスト名に実行時に合わせます（個別デプロイURLや `portfolio.my-mc.workers.dev` で見た場合も正しく表示されます）。

最初の `main` のデプロイで `routes` の Custom Domain が作成され、DNSレコードと証明書が自動で用意されます（反映まで数分かかることがあります）。

## 3. 公開後の確認

```sh
curl -sI https://my-mc.dev/ | head -5          # 200
curl -sI https://my-mc.dev/about | grep -i location   # /about/ へ転送
curl -s -o /dev/null -w '%{http_code}\n' https://my-mc.dev/nope/   # 404
curl -sL https://my-mc.dev/hi                   # curl名刺
```

名刺のQRコードは `bun run qr` で `artifacts/qr.svg`・`qr.png` に生成します。

## 補足

- 本番は `portfolio.my-mc.workers.dev` でも同じ内容が見えます（canonical は `my-mc.dev`）。`workers_dev: false` にすると隠せますが、workers.dev 上のプレビューに影響しないか確認してから変更してください。
- `www.my-mc.dev` も使う場合は、`www` に proxied の `AAAA 100::` レコードを作り、Redirect Rules で `https://my-mc.dev` へ301転送します。

## 手動公開（緊急時）

```sh
bunx wrangler login
WORKERS_CI_BRANCH=main SITE_RELEASE=1 bun run build:cloudflare
bunx wrangler deploy
```
