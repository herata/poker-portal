# API インターフェース仕様

## 店舗データAPI

### 店舗一覧取得

```typescript
// GET /api/stores
interface StoreListResponse {
  stores: StorePreview[];
  total: number;
  page: number;
  limit: number;
}

interface StorePreview {
  id: string;
  name: string;
  area: string;
  sub_area?: string;
  address: string;
  main_image_url?: string;
  rating: number;
  review_count: number;
  latitude: number;
  longitude: number;
}
```

### 近隣店舗取得

```typescript
// GET /api/stores/nearby?lat={latitude}&lng={longitude}&radius={radiusInKm}
interface NearbyStoresResponse {
  stores: StorePreview[];
  total: number;
}
```

### 店舗詳細取得

```typescript
// GET /api/stores/{id}
interface StoreDetailResponse {
  id: string;
  name: string;
  description?: string;
  address: string;
  area: string;
  sub_area?: string;
  latitude: number;
  longitude: number;
  hours?: string;
  contacts: StoreContact;
  fees: StoreFees;
  chip_rates: ChipRate[];
  discounts: Discount[];
  holidays: Holiday[];
  amenities: string[];
  images: string[];
  games: Game[];
  rating: number;
  review_count: number;
  reviews: Review[];
  is_verified: boolean;
}

interface StoreContact {
  phone?: string;
  email?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
}

interface StoreFees {
  entry_fee?: number;
  membership_fee?: number;
}

interface ChipRate {
  id: string;
  bb_amount: number;
  price_per_bb: number;
}

interface Discount {
  id: string;
  name: string;
  description?: string;
}

interface Holiday {
  id: string;
  day_of_week?: number; // 0=日曜, 1=月曜, ...
  specific_date?: string; // YYYY-MM-DD形式
}

interface Game {
  id: string;
  type: string; // 'cash' | 'tournament' など
  name: string;
  description?: string;
  schedule?: string;
  buy_in?: number; // トーナメントの場合
  guarantee?: number; // トーナメントの場合
}

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment?: string;
  visit_date?: string;
  created_at: string;
}
```

## ユーザーデータAPI

### お気に入り店舗一覧取得

```typescript
// GET /api/user/favorites
interface FavoriteStoresResponse {
  stores: StorePreview[];
  total: number;
}
```

### お気に入り店舗追加

```typescript
// POST /api/user/favorites
interface AddFavoriteRequest {
  store_id: string;
}

interface AddFavoriteResponse {
  success: boolean;
}
```

### お気に入り店舗削除

```typescript
// DELETE /api/user/favorites/{store_id}
interface RemoveFavoriteResponse {
  success: boolean;
}
```

### 訪問済み店舗追加

```typescript
// POST /api/user/visited
interface AddVisitedRequest {
  store_id: string;
  visit_date?: string; // YYYY-MM-DD形式
}

interface AddVisitedResponse {
  success: boolean;
}
```

## レビューAPI

### レビュー投稿

```typescript
// POST /api/reviews
interface AddReviewRequest {
  store_id: string;
  rating: number; // 1-5
  comment?: string;
  visit_date?: string; // YYYY-MM-DD形式
}

interface AddReviewResponse {
  id: string;
  store_id: string;
  success: boolean;
}
```

### レビュー更新

```typescript
// PUT /api/reviews/{id}
interface UpdateReviewRequest {
  rating?: number; // 1-5
  comment?: string;
  visit_date?: string; // YYYY-MM-DD形式
}

interface UpdateReviewResponse {
  success: boolean;
}
```

### レビュー削除

```typescript
// DELETE /api/reviews/{id}
interface DeleteReviewResponse {
  success: boolean;
}
```

## イベントAPI

### イベント一覧取得

```typescript
// GET /api/events?store_id={store_id}
interface EventListResponse {
  events: EventPreview[];
  total: number;
}

interface EventPreview {
  id: string;
  store_id: string;
  store_name: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  buy_in?: number;
  guarantee?: number;
  image_url?: string;
  capacity?: number;
  registered_count: number;
}
```

### イベント詳細取得

```typescript
// GET /api/events/{id}
interface EventDetailResponse extends EventPreview {
  // 追加の詳細情報
}
```