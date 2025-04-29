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

## バックエンドアーキテクチャ

### Cloudflare D1 リレーショナルデータベーススキーマ設計

PokerPortalでは、以下のCloudflare D1テーブルを使用してデータを管理します。

#### storesテーブル

会場情報を管理するメインテーブルです。

```sql
CREATE TABLE stores (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  area TEXT NOT NULL,
  sub_area TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  hours TEXT,
  is_verified BOOLEAN DEFAULT false,
  main_image_url TEXT,
  rating REAL DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- エリアとサブエリアによる検索を高速化するためのインデックス
CREATE INDEX idx_stores_area ON stores(area);
CREATE INDEX idx_stores_sub_area ON stores(sub_area);
-- 評価によるソートを高速化するためのインデックス
CREATE INDEX idx_stores_rating ON stores(rating);
```

#### store_contactsテーブル

会場の連絡先情報を管理するテーブルです。

```sql
CREATE TABLE store_contacts (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  twitter TEXT,
  instagram TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_store_contacts_store_id ON store_contacts(store_id);
```

#### store_feesテーブル

会場の料金情報を管理するテーブルです。

```sql
CREATE TABLE store_fees (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  entry_fee INTEGER,
  membership_fee INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_store_fees_store_id ON store_fees(store_id);
```

#### chip_ratesテーブル

チップレート（BB単価）情報を管理するテーブルです。

```sql
CREATE TABLE chip_rates (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  bb_amount INTEGER NOT NULL,
  price_per_bb INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_chip_rates_store_id ON chip_rates(store_id);
```

#### discountsテーブル

割引情報を管理するテーブルです。

```sql
CREATE TABLE discounts (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_discounts_store_id ON discounts(store_id);
```

#### holidaysテーブル

会場の定休日情報を管理するテーブルです。

```sql
CREATE TABLE holidays (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  day_of_week INTEGER,
  specific_date TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_holidays_store_id ON holidays(store_id);
```

#### amenitiesテーブル

アメニティ情報を管理するテーブルです。

```sql
CREATE TABLE amenities (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### store_amenitiesテーブル

会場とアメニティの関連付けを管理する中間テーブルです。

```sql
CREATE TABLE store_amenities (
  store_id TEXT NOT NULL,
  amenity_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (store_id, amenity_id),
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);
```

#### gamesテーブル

会場で開催されるゲーム情報を管理するテーブルです。

```sql
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  type TEXT NOT NULL, -- キャッシュ、トーナメントなど
  name TEXT NOT NULL,
  description TEXT,
  schedule TEXT,
  buy_in INTEGER,
  guarantee INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_games_store_id ON games(store_id);
CREATE INDEX idx_games_type ON games(type);
```

#### store_imagesテーブル

会場の画像URLを管理するテーブルです。

```sql
CREATE TABLE store_images (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_store_images_store_id ON store_images(store_id);
```

#### usersテーブル

ユーザー情報を管理するテーブルです。

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### user_favoritesテーブル

ユーザーのお気に入り会場を管理する中間テーブルです。

```sql
CREATE TABLE user_favorites (
  user_id TEXT NOT NULL,
  store_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
```

#### user_visited_storesテーブル

ユーザーの訪問済み会場を管理する中間テーブルです。

```sql
CREATE TABLE user_visited_stores (
  user_id TEXT NOT NULL,
  store_id TEXT NOT NULL,
  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
```

#### reviewsテーブル

ユーザーによる会場レビューを管理するテーブルです。

```sql
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL, -- 1から5までの整数
  comment TEXT,
  visit_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_store_id ON reviews(store_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

#### eventsテーブル

ポーカーイベント情報を管理するテーブルです。

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  buy_in INTEGER,
  guarantee INTEGER,
  image_url TEXT,
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_events_store_id ON events(store_id);
CREATE INDEX idx_events_start_date ON events(start_date);
```

### APIインターフェース

PokerPortalのバックエンドAPIは、RESTful設計に基づいて実装されています。すべてのエンドポイントは `/api` プレフィックスを持ちます。

#### 会場 API

```typescript
// 会場一覧を取得
GET /api/stores
Query params:
  area?: string           // エリアでフィルター
  subArea?: string        // サブエリアでフィルター
  search?: string         // 検索キーワード
  amenities?: string[]    // アメニティでフィルター
  entryFeeMin?: number    // 最小入場料
  entryFeeMax?: number    // 最大入場料
  chipRateMin?: number    // 最小チップレート
  chipRateMax?: number    // 最大チップレート
  bbAmount?: number       // BB数
  sort?: string           // 並び替えフィールド
  order?: 'asc' | 'desc'  // 並び替え順序
  page?: number           // ページ番号
  limit?: number          // 1ページの表示件数
Response: {
  items: Store[];         // 会場リスト
  totalCount: number;     // 総件数
  page: number;           // 現在のページ
  pageCount: number;      // 総ページ数
}

// 特定の会場を取得
GET /api/stores/:id
Response: Store

// 近くの会場を検索
GET /api/stores/nearby
Query params:
  latitude: number        // 現在の緯度
  longitude: number       // 現在の経度
  radius?: number         // 検索半径（km）
  limit?: number          // 取得件数
Response: Store[]

// 会場レビューを取得
GET /api/stores/:id/reviews
Query params:
  sort?: string           // 並び替えフィールド
  order?: 'asc' | 'desc'  // 並び替え順序
  page?: number           // ページ番号
  limit?: number          // 1ページの表示件数
Response: {
  items: Review[];        // レビューリスト
  totalCount: number;     // 総件数
  averageRating: number;  // 平均評価
  page: number;           // 現在のページ
  pageCount: number;      // 総ページ数
}

// 会場イベントを取得
GET /api/stores/:id/events
Query params:
  upcoming?: boolean      // 今後のイベントのみ
  page?: number           // ページ番号
  limit?: number          // 1ページの表示件数
Response: {
  items: Event[];         // イベントリスト
  totalCount: number;     // 総件数
  page: number;           // 現在のページ
  pageCount: number;      // 総ページ数
}
```

#### ユーザー API

```typescript
// ユーザープロファイルを取得
GET /api/users/profile
Response: User

// お気に入り会場を取得
GET /api/users/favorites
Response: Store[]

// お気に入りに会場を追加
POST /api/users/favorites
Request: { storeId: string }
Response: { success: boolean }

// お気に入りから会場を削除
DELETE /api/users/favorites/:storeId
Response: { success: boolean }

// 訪問済み会場を取得
GET /api/users/visited
Response: Store[]

// 訪問済みに会場を追加
POST /api/users/visited
Request: { storeId: string }
Response: { success: boolean }

// 訪問済みから会場を削除
DELETE /api/users/visited/:storeId
Response: { success: boolean }
```

#### レビュー API

```typescript
// レビューを投稿
POST /api/reviews
Request: {
  storeId: string;
  rating: number;
  comment: string;
  visitDate: string;
}
Response: Review

// レビューを更新
PUT /api/reviews/:id
Request: {
  rating?: number;
  comment?: string;
  visitDate?: string;
}
Response: Review

// レビューを削除
DELETE /api/reviews/:id
Response: { success: boolean }
```

#### イベント API

```typescript
// イベント一覧を取得
GET /api/events
Query params:
  upcoming?: boolean      // 今後のイベントのみ
  storeId?: string        // 特定の会場のイベント
  page?: number           // ページ番号
  limit?: number          // 1ページの表示件数
Response: {
  items: Event[];         // イベントリスト
  totalCount: number;     // 総件数
  page: number;           // 現在のページ
  pageCount: number;      // 総ページ数
}

// 特定のイベントを取得
GET /api/events/:id
Response: Event
```

### Lambda関数の実装イメージ

AWSのLambda関数を使用してサーバーレス環境でバックエンドAPIを実装します。各API機能に対応するLambda関数の実装例を示します。

#### 会場検索Lambda関数

```typescript
// storeSearchLambda.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const STORES_TABLE = process.env.STORES_TABLE || 'Stores';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // クエリパラメータの取得
    const queryParams = event.queryStringParameters || {};
    const {
      area,
      subArea,
      search,
      amenities,
      entryFeeMin,
      entryFeeMax,
      chipRateMin,
      chipRateMax,
      bbAmount,
      sort = 'name',
      order = 'asc',
      page = '1',
      limit = '20'
    } = queryParams;

    // DynamoDBのクエリパラメータを構築
    let params: any = {
      TableName: STORES_TABLE,
    };

    // エリアによるフィルタリング
    if (area && area !== 'all') {
      // GSIを使用してエリアでクエリ
      params.IndexName = 'area-index';
      params.KeyConditionExpression = 'area = :area';
      params.ExpressionAttributeValues = {
        ':area': area
      };
    } else {
      // エリア指定がない場合はスキャン
      params.Scan = true;
    }

    // フィルター式の構築
    let filterExpressions = [];
    let expressionAttributeValues = params.ExpressionAttributeValues || {};

    // サブエリアでフィルタリング
    if (subArea) {
      filterExpressions.push('subArea = :subArea');
      expressionAttributeValues[':subArea'] = subArea;
    }

    // 検索キーワードによるフィルタリング
    if (search) {
      filterExpressions.push('contains(#name, :search) OR contains(address, :search) OR contains(description, :search)');
      expressionAttributeValues[':search'] = search;
      params.ExpressionAttributeNames = params.ExpressionAttributeNames || {};
      params.ExpressionAttributeNames['#name'] = 'name';
    }

    // 入場料でのフィルタリング
    if (entryFeeMin) {
      filterExpressions.push('fees.entryFee >= :entryFeeMin');
      expressionAttributeValues[':entryFeeMin'] = Number(entryFeeMin);
    }
    if (entryFeeMax) {
      filterExpressions.push('fees.entryFee <= :entryFeeMax');
      expressionAttributeValues[':entryFeeMax'] = Number(entryFeeMax);
    }

    // チップレートでのフィルタリング
    if (bbAmount && (chipRateMin || chipRateMax)) {
      // 指定BB数のチップレートをフィルタ（実際の実装ではより複雑になる可能性あり）
      if (chipRateMin) {
        filterExpressions.push('contains(fees.chipRates[*].pricePerBB, :chipRateMin)');
        expressionAttributeValues[':chipRateMin'] = Number(chipRateMin);
      }
      if (chipRateMax) {
        filterExpressions.push('contains(fees.chipRates[*].pricePerBB, :chipRateMax)');
        expressionAttributeValues[':chipRateMax'] = Number(chipRateMax);
      }
    }

    // アメニティでのフィルタリング
    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : [amenities];
      amenitiesList.forEach((amenity, index) => {
        const placeholder = `:amenity${index}`;
        filterExpressions.push(`contains(amenities, ${placeholder})`);
        expressionAttributeValues[placeholder] = amenity;
      });
    }

    // フィルター式の追加
    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
      params.ExpressionAttributeValues = {
        ...params.ExpressionAttributeValues,
        ...expressionAttributeValues
      };
    }

    // DynamoDBからデータを取得
    const result = params.KeyConditionExpression 
      ? await dynamoDb.query(params).promise()
      : await dynamoDb.scan(params).promise();

    // 並び替え
    let items = result.Items || [];
    items = sortItems(items, sort, order);

    // ページング
    const pageNum = Number(page);
    const pageSize = Number(limit);
    const startIndex = (pageNum - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);
    const totalCount = items.length;
    const pageCount = Math.ceil(totalCount / pageSize);

    // レスポンスの構築
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: paginatedItems,
        totalCount,
        page: pageNum,
        pageCount
      })
    };
  } catch (error) {
    console.error('Error searching stores:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

// 並び替え関数
function sortItems(items: any[], sort: string, order: string) {
  return [...items].sort((a, b) => {
    let valueA, valueB;
    
    // ソートフィールドに基づいて値を取得
    switch (sort) {
      case 'entryFee':
        valueA = a.fees?.entryFee;
        valueB = b.fees?.entryFee;
        break;
      case 'chipRate':
        // 代表的なチップレートで比較（100BBを想定）
        valueA = a.fees?.chipRates?.find((rate: any) => rate.bbAmount === 100)?.pricePerBB;
        valueB = b.fees?.chipRates?.find((rate: any) => rate.bbAmount === 100)?.pricePerBB;
        break;
      case 'rating':
        valueA = a.rating;
        valueB = b.rating;
        break;
      case 'name':
      default:
        valueA = a.name;
        valueB = b.name;
    }

    // nullまたはundefinedの場合の処理
    if (valueA === undefined || valueA === null) {
      return order === 'asc' ? -1 : 1;
    }
    if (valueB === undefined || valueB === null) {
      return order === 'asc' ? 1 : -1;
    }

    // 並び替え
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    return order === 'asc' ? valueA - valueB : valueB - valueA;
  });
}
```

#### 近くの会場検索Lambda関数

```typescript
// nearbyStoresLambda.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const STORES_TABLE = process.env.STORES_TABLE || 'Stores';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const queryParams = event.queryStringParameters || {};
    const {
      latitude,
      longitude,
      radius = '5', // デフォルト5km
      limit = '10'
    } = queryParams;

    if (!latitude || !longitude) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: '緯度と経度のパラメータが必要です' })
      };
    }

    // 全ての店舗を取得（実際の実装では効率化が必要）
    const result = await dynamoDb.scan({
      TableName: STORES_TABLE
    }).promise();

    const items = result.Items || [];
    
    // 現在位置からの距離を計算して並べ替え
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);
    const lim = parseInt(limit);
    
    const nearbyStores = items
      .filter(store => {
        const distance = calculateDistance(
          lat,
          lng,
          store.coordinates.latitude,
          store.coordinates.longitude
        );
        store.distance = distance; // 距離を追加
        return distance <= rad; // 半径内のみ
      })
      .sort((a, b) => a.distance - b.distance) // 距離でソート
      .slice(0, lim); // 指定件数に制限
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(nearbyStores)
    };
  } catch (error) {
    console.error('Error fetching nearby stores:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

// ハーバーサイン公式による2点間の距離計算（km単位）
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}
```

#### ユーザーのお気に入り操作Lambda関数

```typescript
// userFavoritesLambda.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || 'Users';
const STORES_TABLE = process.env.STORES_TABLE || 'Stores';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // APIゲートウェイから認証済みユーザーIDを取得（実際の実装ではCognitoなどを使用）
    const userId = getUserIdFromEvent(event);
    if (!userId) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: '認証が必要です' })
      };
    }

    // HTTPメソッドによって操作を分岐
    switch (event.httpMethod) {
      case 'GET':
        return await getFavorites(userId);
      case 'POST':
        return await addFavorite(userId, event);
      case 'DELETE':
        return await removeFavorite(userId, event);
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    console.error('Error handling favorites:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

// ユーザーのお気に入り店舗一覧を取得
async function getFavorites(userId: string): Promise<APIGatewayProxyResult> {
  // ユーザーデータを取得
  const userResult = await dynamoDb.get({
    TableName: USERS_TABLE,
    Key: { id: userId }
  }).promise();

  const user = userResult.Item;
  if (!user) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'ユーザーが見つかりません' })
    };
  }

  const favorites = user.favorites || [];
  
  // お気に入りがない場合は空配列を返す
  if (favorites.length === 0) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify([])
    };
  }

  // お気に入りの会場情報を一括取得（バッチ操作）
  const favoriteStores = await Promise.all(
    favorites.map(async (storeId: string) => {
      const storeResult = await dynamoDb.get({
        TableName: STORES_TABLE,
        Key: { id: storeId }
      }).promise();
      return storeResult.Item;
    })
  );

  // nullや未定義の結果をフィルタリング
  const validStores = favoriteStores.filter(store => store);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(validStores)
  };
}

// お気に入りに店舗を追加
async function addFavorite(userId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const requestBody = JSON.parse(event.body || '{}');
  const { storeId } = requestBody;

  if (!storeId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: '店舗IDが必要です' })
    };
  }

  // 店舗の存在確認
  const storeResult = await dynamoDb.get({
    TableName: STORES_TABLE,
    Key: { id: storeId }
  }).promise();

  if (!storeResult.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: '指定された店舗が見つかりません' })
    };
  }

  // ユーザーのお気に入りリストを更新
  await dynamoDb.update({
    TableName: USERS_TABLE,
    Key: { id: userId },
    UpdateExpression: 'ADD favorites :storeId',
    ExpressionAttributeValues: {
      ':storeId': dynamoDb.createSet([storeId])
    },
    ReturnValues: 'UPDATED_NEW'
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ success: true })
  };
}

// お気に入りから店舗を削除
async function removeFavorite(userId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const storeId = event.pathParameters?.storeId;

  if (!storeId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: '店舗IDが必要です' })
    };
  }

  // ユーザーのお気に入りリストを更新
  await dynamoDb.update({
    TableName: USERS_TABLE,
    Key: { id: userId },
    UpdateExpression: 'DELETE favorites :storeId',
    ExpressionAttributeValues: {
      ':storeId': dynamoDb.createSet([storeId])
    },
    ReturnValues: 'UPDATED_NEW'
  }).promise();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ success: true })
  };
}

// Event情報からユーザーIDを抽出（実際のアプリケーションでは認証方法に応じて変更）
function getUserIdFromEvent(event: APIGatewayProxyEvent): string | null {
  // 認証コンテキストやヘッダからユーザーIDを取得
  // この例ではヘッダーから取得する想定
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader) {
    return null;
  }

  // 認証トークンを処理してユーザーIDを返す
  // 実際のアプリケーションではここでJWTの検証などを行う
  try {
    // この実装は例示用。実際にはトークンを検証し、正当なユーザーIDを返す
    const token = authHeader.replace('Bearer ', '');
    // トークンからユーザーIDを抽出する処理（実装省略）
    return 'example-user-id'; // 実際の実装ではトークンから抽出されたIDを返す
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
}
```

### デプロイアーキテクチャ

PokerPortalのバックエンドは、AWS CloudFormationを使用して以下のようなインフラストラクチャをデプロイします：

1. **API Gateway**: HTTPリクエストを受け付け、適切なLambda関数にルーティング
2. **Lambda関数**: APIの各エンドポイントに対応する処理を実行
3. **DynamoDB**: データの永続化層として機能
4. **Cognito**: ユーザー認証と認可を管理
5. **CloudFront**: CDNとしてフロントエンドアセットを配信
6. **S3**: 静的ファイルの保存
7. **CloudWatch**: ログ記録とモニタリング

### セキュリティ考慮事項

- すべてのAPIリクエストはCognitoで認証を行い、適切な権限チェックを実施
- DynamoDBへのアクセスはIAMロールで制限され、最小権限の原則に従う
- APIキーの使用やレートリミットによるAPI保護
- HTTPS通信の強制とセキュリティヘッダの設定
- センシティブデータの暗号化

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
