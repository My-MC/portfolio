---

title: surreal-knowledge-base
description: 組み込みSurrealDBとBAAI/bge-m3を使った、ローカル完結のナレッジベース。ベクトル検索とBM25のハイブリッド検索・知識グラフをMCPサーバー / CLIとして提供。
status: active
technologies: [Rust, SurrealDB, bge-m3, MCP]
tags: [rust, ai]
role: 個人開発
repositoryUrl: https://github.com/My-MC/surreal-knowledge-base
order: 5
---

## 概要

手元のドキュメントを、外部サービスに送らずに検索できるナレッジベースです。組み込みのSurrealDBにベクトルとテキストを保存し、ベクトル検索とBM25を組み合わせたハイブリッド検索と知識グラフを提供します。

AIエージェントから使えるようにMCPサーバーとして公開でき、CLIからも操作できます。
