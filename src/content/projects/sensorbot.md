---

title: SensorBot
description: Arduino（ロードセルHX711 + 赤外線センサー）で鍵の有無を検出し、貸出状況と合わせてDiscordへ通知するBot。
status: completed
technologies: [Python, Arduino, HX711, Discord]
tags: [python]
role: 個人開発
repositoryUrl: https://github.com/My-MC/SensorBot
order: 7
---

## 概要

部室などの鍵の「物理的な有無」をArduinoのセンサーで検出し、Discordに通知するBotです。鍵の貸出・返却はDiscordのスラッシュコマンドとUIから「申告」として登録し、センサーの物理状態とは独立に管理します。

## 特長

- 申告と物理状態が食い違うと警告（例：貸出登録なしで鍵が持ち出された）
- 赤外線と荷重の判定の不一致や、センサーのheartbeat途絶・復旧も通知
- 操作はすべてスラッシュコマンドとDiscord UI（Select / Button）で完結
