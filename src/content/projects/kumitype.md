---

title: KumiType
description: Cascadia Code / Monoと日本語フォントを合成し、エディター・ターミナル向けのフォントを再現可能にビルドするシステム。
status: active
technologies: [Python 3.14, uv, FontTools, Docker]
tags: [python, font]
role: 個人開発
repositoryUrl: https://github.com/My-MC/KumiType
featured: true
order: 2
---

## 概要

KumiType（組みタイプ）は、Cascadia Code / Monoに日本語書体を合成して、プログラミング用のフォントを生成するビルドシステムです。通常版・Powerline版・Nerd Fonts版に対応しています。

## 特長

- ベース6系列 × 日本語書体7種 × 6ウェイト × 2スタイルで、**504本のTTF**（42ファミリー）を生成
- IBM Plex Sans JP、BIZ UDGothic、Noto Sans JP、LINE Seed JP、M PLUS 1 / 2、Zen Kaku Gothic Newに対応
- ソースを固定版とSHA-256で管理し、オフラインでも同じ結果を再ビルドできる
- Python 3.14と`uv`で依存を固定し、Dockerでも同じ手順でビルド可能
