---

title: 自宅ラボ
description: Proxmox VE上にIncusやVyOSで検証用ネットワークを組み、監視と通知まで自分で運用している自宅インフラ。
status: active
technologies: [Proxmox VE, Incus, VyOS, nftables, Prometheus, Alertmanager]
tags: [homelab, infra, network, linux]
role: 設計・運用
featured: true
order: 4
---

## 概要

自宅のサーバーで、ネットワークやサーバー運用を試すためのラボを運用しています。設定はなるべくファイルで管理し、再現できる形にすることを意識しています。

## 構成

- **仮想化基盤**：Proxmox VE。用途ごとにVMを分け、検証用のIncusホストを置いています
- **検証ネットワーク**：Incus上のVyOSでルーターを組み、ルーティングを試しています
- **外部接続**：SDCCのお力添えをいただき、BGP接続を勉強させてもらっています
- **セキュリティ**：nftablesとSSHの設定で、外部に開くものを最小限に
- **監視**：Prometheus / AlertmanagerからDiscordにアラートを通知
- **リモートアクセス**：Tailscale

## これから

BGPで受け取った経路をラボ内で扱う構成や、監視のダッシュボード整備を進めていく予定です。
