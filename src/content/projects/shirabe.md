---

title: Shirabe Meter Suite
description: 放送・音楽制作で使う各種メーターを1画面で切り替え・組み合わせて表示する、Rust製のオーディオメーター（VST3 / CLAP / スタンドアロン）。
status: active
technologies: [Rust, VST3, CLAP, GitHub Actions]
tags: [rust, audio]
role: 個人開発
repositoryUrl: https://github.com/My-MC/shirabe
featured: true
order: 1
---

## 概要

Shirabe（調べ）は、VU・PPM・トゥルーピーク・ラウドネスなど、放送や音楽制作で使われるメーターをタイル状に並べて表示するためのオーディオメーターです。DAWに挿すVST3 / CLAPプラグインと、DAWなしで動くスタンドアロンアプリの両方を同じコードから生成します。

## 特長（目標）

- 音を一切加工しないパススルー動作で、レイテンシーは0
- ITU-R BS.1770 / EBU R128 / ARIB TR-B32 のラウドネス、リサージュ、相関、スペクトラムなどを順次実装
- レイアウトとテーマをファイルとして保存・共有
- Windows x64を最優先に、macOS・Linuxにも対応

## 現在の状況

基盤づくりの段階で、サンプルピークメーター（モノラル / ステレオ / 5.1）とテストオシレーターが動きます。各プラットフォーム向けのビルドはGitHub Actionsで生成しています。
