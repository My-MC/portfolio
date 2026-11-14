---

title: gemma-on-device
description: Hugging FaceのONNX言語モデルを、Rust・ONNX Runtime・Tauriでデスクトップとモバイル上のローカル環境で動かすアプリ。
status: active
technologies: [Rust, ONNX Runtime, Tauri, TypeScript]
tags: [rust, ai]
role: 個人開発
repositoryUrl: https://github.com/My-MC/gemma-on-device
order: 6
---

## 概要

Hugging Face上のONNX形式の言語モデルを、端末上だけで動かすためのアプリです。モデルのダウンロード、ストリーミングでのチャット、推論ベンチマークを備えています。

推論部分はRustとONNX Runtime、UIはTauriで実装し、デスクトップとモバイルの両方を対象にしています。
