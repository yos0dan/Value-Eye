# バリュー眼 (Value-Eye)

容量の錯覚を見抜く、究極の単価比較ツール。

> "大容量 ＝ お得" — その思い込み、バリュー眼が打ち破ります。

## Features

- **2つの比較モード**:
  - **容量モード**: 価格・容量・単位（g, kg, ml, L, 個）から1単位あたりの価格を計算。
  - **ポイントモード**: ポイント還元率と個数を加味した実質単価を計算。
- **最安値の自動判定**: もっともお得な商品をハイライトし、割高な商品の損益率を可視化。
- **履歴保存 & 復元**: 比較結果は場所情報（任意）とともにブラウザ (IndexedDB) に自動保存。
- **付近のスーパー検索**: OpenStreetMap (Leaflet) を利用して周辺のスーパーや履歴の場所をマップ表示。
- **PWA 対応**: ホーム画面に追加してオフラインでも軽快に利用可能。
- **ダークモード対応**: システム設定や好みに合わせた快適な表示。
- **エクスポート**: 全ての履歴を JSON 形式でバックアップ可能。

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5 / Runes mode)
- **Styling**: Modern CSS (Custom Properties / Grid / Flexbox)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Map**: [Leaflet](https://leafletjs.com/) (OpenStreetMap / Overpass API)
- **Persistence**: IndexedDB (LocalForage)
- **Deployment**: GitHub Pages (Static Adapter)

## Architecture

本プロジェクトは **Svelte 5** の最新機能を最大限に活用し、軽量かつメンテナブルな構成を採用しています。

- **Runes**: `$state`, `$derived`, `$props` による直感的で高性能なリアクティビティ。
- **CSS-First Components**: 独自の Flutter 風コンポーネントを廃止し、標準的な HTML/CSS をベースとした軽量な UI コア（`Card`, `Button`, `Input` など）を構築。
- **Design Tokens**: 余白、角丸、影などのデザイン設定を CSS 変数として一元管理。
- **Class-based State**: アプリケーションの状態とロジックを `AppState` クラスに集約し、コンポーネント間の疎結合を実現。

## Getting Started

```bash
# Install dependencies
bun install    # or: npm install

# Start dev server
bun run dev    # or: npm run dev

# Build for production
bun run build  # or: npm run build

# Preview production build
bun run preview
```

### Optional: Local HTTPS

位置情報（Geolocation API）をローカル環境でテストするには HTTPS が必要です。`certs/` ディレクトリに証明書を配置すると自動で適用されます：

```
certs/
  server.key
  server.crt
```

## Deployment

GitHub Actions を通じて **GitHub Pages** に自動デプロイされます。

1. `main` ブランチへプッシュ
2. GitHub リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選択

## License

MIT
