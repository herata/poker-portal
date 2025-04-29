# Cloudflare D1 リレーショナルデータベーススキーマ設計

PokerPortalでは、以下のCloudflare D1テーブルを使用してデータを管理します。

## storesテーブル

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

## store_contactsテーブル

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

## store_feesテーブル

会場の料金情報を管理するテーブルです。

```sql
CREATE TABLE store_fees (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  entry_fee_per_day INTEGER, -- 1日あたりの入場料
  entry_fee_description TEXT, -- 入場料の詳細情報（テキスト形式）
  membership_fee INTEGER, -- 会員費
  chip_fee_base_per_100bb INTEGER, -- 基準となる100BBあたりのチップ料金
  chip_fee_description TEXT, -- チップ料金の詳細情報（テキスト形式）
  chip_deposit_base_per_100bb INTEGER, -- 基準となる100BBあたりのチップ預け料金
  chip_deposit_description TEXT, -- チップ預け料金の詳細情報（テキスト形式）
  chip_withdrawal_base_per_100bb INTEGER, -- 基準となる100BBあたりのチップ引き出し料金
  chip_withdrawal_description TEXT, -- チップ引き出し料金の詳細情報（テキスト形式）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

CREATE INDEX idx_store_fees_store_id ON store_fees(store_id);
CREATE INDEX idx_store_fees_chip_fee ON store_fees(chip_fee_base_per_100bb);
```

## discountsテーブル

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

## holidaysテーブル

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

## amenitiesテーブル

アメニティ情報を管理するテーブルです。

```sql
CREATE TABLE amenities (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## store_amenitiesテーブル

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

## gamesテーブル

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

## store_imagesテーブル

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

## google_usersテーブル

Googleアカウントによるサインインユーザー情報を管理するテーブルです。

```sql
CREATE TABLE google_users (
  id TEXT PRIMARY KEY, -- Google提供のユニークID
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  picture TEXT, -- プロフィール画像URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_google_users_email ON google_users(email);
```

## user_favoritesテーブル

ユーザーのお気に入り会場を管理する中間テーブルです。

```sql
CREATE TABLE user_favorites (
  user_id TEXT NOT NULL,
  store_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES google_users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
```

## user_visited_storesテーブル

ユーザーの訪問済み会場を管理する中間テーブルです。

```sql
CREATE TABLE user_visited_stores (
  user_id TEXT NOT NULL,
  store_id TEXT NOT NULL,
  visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, store_id),
  FOREIGN KEY (user_id) REFERENCES google_users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
```

## reviewsテーブル

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
  FOREIGN KEY (user_id) REFERENCES google_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_store_id ON reviews(store_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

## eventsテーブル

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