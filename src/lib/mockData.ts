export interface Store {
	id: string;
	slug: string;
	name: string;
	address: string;
	latitude: number;
	longitude: number;
	hours: string;
	entryFee: string;
	chipRate: string;
	depositFee: string;
	withdrawalFee: string;
	amenities: string[];
	imageUrl?: string;
	description?: string;
	area?: string; // Added for filtering by area
}

export const mockStores: Store[] = [
	{
		id: "1",
		slug: "poker-place-shibuya",
		name: "ポーカースポット渋谷",
		address: "東京都渋谷区道玄坂X-X-X ABCビル 3F",
		latitude: 35.6595,
		longitude: 139.7005,
		hours: "平日 18:00-24:00 / 土日祝 15:00-24:00",
		entryFee: "¥2,000",
		chipRate: "¥1,000 / $100",
		depositFee: "無料",
		withdrawalFee: "無料",
		amenities: ["初心者講習あり", "ドリンク飲み放題", "Wi-Fi完備"],
		imageUrl: "https://plus.unsplash.com/premium_photo-1694004710242-c90943f0c280",
		description:
			"渋谷駅から徒歩5分！初心者から上級者まで楽しめるアットホームなポーカースポットです。定期的にトーナメントも開催中！",
		area: "渋谷",
	},
	{
		id: "2",
		slug: "casino-lounge-shinjuku",
		name: "カジノラウンジ新宿",
		address: "東京都新宿区西新宿Y-Y-Y XYZタワー 10F",
		latitude: 35.6909,
		longitude: 139.6981,
		hours: "17:00-翌5:00 (年中無休)",
		entryFee: "¥3,000 (1ドリンク付き)",
		chipRate: "¥3,000 / $200",
		depositFee: "チップ額の5%",
		withdrawalFee: "$100毎に¥100",
		amenities: [
			"本格カジノ雰囲気",
			"バーカウンター併設",
			"VIPルームあり",
			"ドレスコードあり",
		],
		imageUrl: "https://images.unsplash.com/photo-1732613243555-85574f6ebfbf",
		description:
			"新宿の夜景を一望できるラグジュアリーな空間で、本格的なポーカーをお楽しみいただけます。",
		area: "新宿",
	},
	{
		id: "3",
		slug: "poker-club-roppongi",
		name: "ポーカークラブ六本木",
		address: "東京都港区六本木Z-Z-Z 六本木ヒルズ B1F",
		latitude: 35.6604,
		longitude: 139.7292,
		hours: "毎日 20:00-翌6:00",
		entryFee: "¥5,000 (フード・ドリンク付き)",
		chipRate: "¥5,000 / $500",
		depositFee: "チップ額の3%",
		withdrawalFee: "チップ額の2%",
		amenities: ["英語対応", "プライベートテーブル", "高額ゲーム", "予約優先"],
		imageUrl: "https://plus.unsplash.com/premium_photo-1719017472059-8d1d0ab3cba5",
		description:
			"六本木の中心地に位置する高級ポーカークラブ。国際的な雰囲気で、海外からのゲストも多数。",
		area: "六本木",
	},
	{
		id: "4",
		slug: "ace-poker-ikebukuro",
		name: "エースポーカー池袋",
		address: "東京都豊島区池袋W-W-W サンシャインビル 5F",
		latitude: 35.7295,
		longitude: 139.7109,
		hours: "平日 19:00-翌3:00 / 土日祝 14:00-翌3:00",
		entryFee: "¥1,500",
		chipRate: "¥1,000 / $100",
		depositFee: "無料",
		withdrawalFee: "無料",
		amenities: [
			"初心者歓迎",
			"フリードリンク",
			"チャージャー完備",
			"女性割引あり",
		],
		imageUrl: "https://plus.unsplash.com/premium_photo-1670007097576-0af87c2dd32e",
		description:
			"池袋駅東口から徒歩3分。リーズナブルな価格で気軽に楽しめるアットホームな雰囲気が魅力です。",
		area: "池袋",
	},
	{
		id: "5",
		slug: "royal-flush-akihabara",
		name: "ロイヤルフラッシュ秋葉原",
		address: "東京都千代田区外神田V-V-V 電気ビル 7F",
		latitude: 35.7,
		longitude: 139.7714,
		hours: "毎日 12:00-24:00",
		entryFee: "¥2,500",
		chipRate: "¥2,000 / $100",
		depositFee: "無料",
		withdrawalFee: "無料",
		amenities: [
			"フードメニューあり",
			"トーナメント多数",
			"初心者講習毎日開催",
			"ポイントカード",
		],
		imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90",
		description:
			"秋葉原の中心部にあるポーカールーム。毎日様々なトーナメントを開催しており、常連から新規のお客様まで楽しめる空間です。",
		area: "秋葉原",
	},
	{
		id: "6",
		slug: "poker-house-ginza",
		name: "ポーカーハウス銀座",
		address: "東京都中央区銀座U-U-U 銀座プレミアムタワー 12F",
		latitude: 35.6721,
		longitude: 139.7636,
		hours: "平日 16:00-翌2:00 / 土日祝 14:00-翌2:00",
		entryFee: "¥4,000",
		chipRate: "¥4,000 / $300",
		depositFee: "チップ額の4%",
		withdrawalFee: "チップ額の1%",
		amenities: [
			"高級内装",
			"プロディーラー常駐",
			"VIPサービス",
			"マッチポット",
		],
		imageUrl: "https://images.unsplash.com/photo-1561631606-861551ea3ee3",
		description:
			"銀座の一等地に位置する高級ポーカールーム。落ち着いた雰囲気の中で本格的なポーカーが楽しめます。接待にも最適。",
		area: "銀座",
	},
];

// Areas for filtering
export const areas = [
	"渋谷",
	"新宿",
	"六本木",
	"池袋",
	"秋葉原",
	"銀座",
	"その他",
];

// Helper to find store by ID
export const getStoreById = (id: string): Store | undefined => {
	return mockStores.find((store) => store.id === id);
};
