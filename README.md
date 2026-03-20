# バリュー眼 (Value-Eye)

容量の錯覚を見抜く、究極の単価比較ツール。

> "大容量 ＝ お得" — その思い込み、バリュー眼が打ち破ります。

## Features

- **単価比較**: 商品の価格・容量・単位を入力して、1単位あたりの価格を即座に計算
- **最安値の自動判定**: もっともお得な商品をハイライト表示
- **履歴保存**: 比較結果はブラウザ (IndexedDB) に自動保存
- **PWA 対応**: ホーム画面に追加してオフラインでも利用可能
- **エクスポート**: 履歴を JSON 形式でダウンロード

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) (Static adapter)
- TypeScript
- [Lucide Icons](https://lucide.dev/)
- IndexedDB (client-side persistence)
- GitHub Pages (hosting)

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

To enable HTTPS in dev, place your cert files in a `certs/` directory:

```
certs/
  server.key
  server.crt
```

The dev server will automatically detect and use them.

## Deployment

This project is configured for **GitHub Pages** via GitHub Actions.

1. Push to the `main` branch
2. Go to **Settings → Pages → Source** → select **GitHub Actions**
3. The workflow will build and deploy automatically

## License

MIT
