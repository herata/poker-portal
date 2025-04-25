# PokerPortal - アミューズメントポーカー情報ポータル

PokerPortalは、日本全国のアミューズメントポーカー会場情報を一覧で確認できるWebサービスです。Next.jsとTailwind CSSを使用して開発されており、Cloudflare Pagesにデプロイされるように設計されています。

![Current Date: 2025年4月26日]

## プロジェクト概要

### 主な機能
- **会場検索**: エリアや条件から会場を簡単に検索できます
- **会場詳細表示**: 各会場の営業時間、料金、設備などの詳細情報を確認できます
- **近くの会場検索**: 位置情報を使って近くのポーカー会場を探せます
- **お気に入り登録**: 気になる会場をお気に入りに登録して後で確認できます
- **訪問履歴**: 訪れた会場が記録され、一目で分かります

### 技術スタック
- **フロントエンド**: Next.js 15.3.0, React 19
- **スタイリング**: Tailwind CSS 4
- **コンポーネント**: Radixベースのカスタムコンポーネント
- **デプロイ**: Cloudflare Pages

## 開発環境のセットアップ

### 前提条件
- Node.js 18.x 以上
- npm, yarn, pnpmまたはbunのいずれか

### インストール手順

1. リポジトリをクローンします:
```bash
git clone https://github.com/yourusername/poker-portal.git
cd poker-portal
```

2. 依存関係をインストールします:
```bash
npm install
# または
yarn install
# または
pnpm install
# または
bun install
```

3. 開発サーバーを起動します:
```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

4. ブラウザで[http://localhost:3000](http://localhost:3000)を開くとアプリケーションが表示されます。

## ビルドとデプロイ

### ローカルビルド
```bash
npm run build
# または
yarn build
# または
pnpm build
# または
bun build
```

### Cloudflareへのデプロイ
このプロジェクトはCloudflare Pagesへのデプロイを前提に設計されています。

1. Cloudflare Pagesのビルド:
```bash
npm run pages:build
# または
yarn pages:build
# または
pnpm pages:build
# または
bun pages:build
```

2. ローカルでのプレビュー:
```bash
npm run preview
# または
yarn preview
# または
pnpm preview
# または
bun preview
```

3. Cloudflare Pagesへのデプロイ:
```bash
npm run deploy
# または
yarn deploy
# または
pnpm deploy
# または
bun deploy
```

## プロジェクトの構成

主要なディレクトリとファイルの構成:

```
src/
  app/                   # アプリケーションのルート
    page.tsx             # ホームページ
    layout.tsx           # 共通レイアウト
    stores/              # 会場一覧・詳細ページ
      page.tsx           # 会場一覧ページ
      [id]/page.tsx      # 会場詳細ページ
    nearby/              # 近くの会場ページ
      page.tsx
    favorites/           # お気に入りページ 
      page.tsx
  components/            # UIコンポーネント
    ui/                  # 基本UIコンポーネント
    NearbyStoreMap.tsx   # 近くの会場マップコンポーネント
  lib/                   # ユーティリティ関数など
```

## 開発用コマンド

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバーを起動（Turbopack使用） |
| `npm run build` | プロジェクトをビルド |
| `npm run start` | ビルドしたプロジェクトを起動 |
| `npm run lint` | コードのリント |
| `npm run fix` | Biomeを使用したコードフォーマット |
| `npm run preview` | CloudflareでのPagesアプリをローカルでプレビュー |
| `npm run deploy` | Cloudflare Pagesにデプロイ |

## Cloudflareとの連携

このプロジェクトはCloudflare Pagesに最適化されています。[Cloudflare Pages](https://pages.cloudflare.com/)環境とアプリケーションを連携させるための追加スクリプトが提供されています：

- `pages:build` - [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLIを使用してPagesのアプリケーションをビルド
- `preview` - [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLIを使用してPagesアプリケーションをローカルでプレビュー
- `deploy` - [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLIを使用してPagesアプリケーションをデプロイ

> __注意:__ `dev`スクリプトはローカル開発に最適ですが、Pagesアプリケーションを定期的に（または本番環境へのデプロイ前に）プレビューして、Pages環境で正常に動作することを確認してください。

## 貢献方法

1. このリポジトリをフォークします
2. 新しいブランチを作成します (`git checkout -b feature/amazing-feature`)
3. 変更をコミットします (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュします (`git push origin feature/amazing-feature`)
5. プルリクエストを作成します

## ライセンス

[MIT License](LICENSE)
