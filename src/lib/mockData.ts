import { v4 as uuidv4 } from "uuid";
import type {
	AddFavoriteRequest,
	AddFavoriteResponse,
	ApiResponse,
	BoundsParams,
	FavoriteStoresResponse,
	NearbyParams,
	RemoveFavoriteResponse,
	SearchParams,
	Store,
	StorePreview,
} from "./types";

// Define mock data directly in the new format
export const mockStores: Store[] = [
	{
		id: "1",
		name: "ポーカースポット渋谷",
		address: "東京都渋谷区道玄坂X-X-X ABCビル 3F",
		area: "渋谷",
		location: {
			latitude: 35.6595,
			longitude: 139.7005,
			geohash: "35.66_139.70",
		},
		hours: "平日 18:00-24:00 / 土日祝 15:00-24:00",
		fees: {
			entryFee: "¥2,000",
			entryFeeNumeric: 2000,
			chipRates: [
				{
					bbAmount: 100,
					price: 1000,
					pricePerBB: 10,
					description: "¥1,000 = $100",
				},
			],
			depositFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			withdrawalFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			feeNotes: "",
		},
		amenities: ["初心者講習あり", "ドリンク飲み放題", "Wi-Fi完備"],
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1694004710242-c90943f0c280",
		imageUrls: [
			"https://plus.unsplash.com/premium_photo-1694004710242-c90943f0c280",
		],
		description:
			"渋谷駅から徒歩5分！初心者から上級者まで楽しめるアットホームなポーカースポットです。定期的にトーナメントも開催中！",
		active: true,
		createdAt: Date.now() - Math.floor(Math.random() * 10000000),
		updatedAt: Date.now(),
	},
	{
		id: "2",
		name: "カジノラウンジ新宿",
		address: "東京都新宿区西新宿Y-Y-Y XYZタワー 10F",
		area: "新宿",
		location: {
			latitude: 35.6909,
			longitude: 139.6981,
			geohash: "35.69_139.70",
		},
		hours: "17:00-翌5:00 (年中無休)",
		fees: {
			entryFee: "¥3,000 (1ドリンク付き)",
			entryFeeNumeric: 3000,
			chipRates: [
				{
					bbAmount: 200,
					price: 3000,
					pricePerBB: 15,
					description: "¥3,000 = $200",
				},
			],
			depositFees: [
				{
					threshold: 0,
					percentage: 5,
					description: "チップ額の5%",
				},
			],
			withdrawalFees: [
				{
					threshold: 0,
					percentage: 1,
					description: "$100毎に¥100",
				},
			],
			feeNotes: "",
		},
		amenities: [
			"本格カジノ雰囲気",
			"バーカウンター併設",
			"VIPルームあり",
			"ドレスコードあり",
		],
		imageUrl: "https://images.unsplash.com/photo-1732613243555-85574f6ebfbf",
		imageUrls: ["https://images.unsplash.com/photo-1732613243555-85574f6ebfbf"],
		description:
			"新宿の夜景を一望できるラグジュアリーな空間で、本格的なポーカーをお楽しみいただけます。",
		active: true,
		createdAt: Date.now() - Math.floor(Math.random() * 10000000),
		updatedAt: Date.now(),
	},
	{
		id: "3",
		name: "ポーカークラブ六本木",
		address: "東京都港区六本木Z-Z-Z 六本木ヒルズ B1F",
		area: "六本木",
		location: {
			latitude: 35.6604,
			longitude: 139.7292,
			geohash: "35.66_139.73",
		},
		hours: "毎日 20:00-翌6:00",
		fees: {
			entryFee: "¥5,000 (フード・ドリンク付き)",
			entryFeeNumeric: 5000,
			chipRates: [
				{
					bbAmount: 500,
					price: 5000,
					pricePerBB: 10,
					description: "¥5,000 = $500",
				},
			],
			depositFees: [
				{
					threshold: 0,
					percentage: 3,
					description: "チップ額の3%",
				},
			],
			withdrawalFees: [
				{
					threshold: 0,
					percentage: 2,
					description: "チップ額の2%",
				},
			],
			feeNotes: "",
		},
		amenities: ["英語対応", "プライベートテーブル", "高額ゲーム", "予約優先"],
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1719017472059-8d1d0ab3cba5",
		imageUrls: [
			"https://plus.unsplash.com/premium_photo-1719017472059-8d1d0ab3cba5",
		],
		description:
			"六本木の中心地に位置する高級ポーカークラブ。国際的な雰囲気で、海外からのゲストも多数。",
		active: true,
		createdAt: Date.now() - Math.floor(Math.random() * 10000000),
		updatedAt: Date.now(),
	},
	{
		id: "4",
		name: "エースポーカー池袋",
		address: "東京都豊島区池袋W-W-W サンシャインビル 5F",
		area: "池袋",
		location: {
			latitude: 35.7295,
			longitude: 139.7109,
			geohash: "35.73_139.71",
		},
		hours: "平日 19:00-翌3:00 / 土日祝 14:00-翌3:00",
		fees: {
			entryFee: "¥1,500",
			entryFeeNumeric: 1500,
			chipRates: [
				{
					bbAmount: 100,
					price: 1000,
					pricePerBB: 10,
					description: "¥1,000 = $100",
				},
			],
			depositFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			withdrawalFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			feeNotes: "",
		},
		amenities: [
			"初心者歓迎",
			"フリードリンク",
			"チャージャー完備",
			"女性割引あり",
		],
		imageUrl:
			"https://plus.unsplash.com/premium_photo-1670007097576-0af87c2dd32e",
		imageUrls: [
			"https://plus.unsplash.com/premium_photo-1670007097576-0af87c2dd32e",
		],
		description:
			"池袋駅東口から徒歩3分。リーズナブルな価格で気軽に楽しめるアットホームな雰囲気が魅力です。",
		active: true,
		createdAt: Date.now() - Math.floor(Math.random() * 10000000),
		updatedAt: Date.now(),
	},
	{
		id: "5",
		name: "ロイヤルフラッシュ秋葉原",
		address: "東京都千代田区外神田V-V-V 電気ビル 7F",
		area: "秋葉原",
		location: {
			latitude: 35.7,
			longitude: 139.7714,
			geohash: "35.70_139.77",
		},
		hours: "毎日 12:00-24:00",
		fees: {
			entryFee: "¥2,500",
			entryFeeNumeric: 2500,
			chipRates: [
				{
					bbAmount: 100,
					price: 2000,
					pricePerBB: 20,
					description: "¥2,000 = $100",
				},
			],
			depositFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			withdrawalFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			feeNotes: "",
		},
		amenities: [
			"フードメニューあり",
			"トーナメント多数",
			"初心者講習毎日開催",
			"ポイントカード",
		],
		imageUrl: "https://images.unsplash.com/photo-1511193311914-0346f16efe90",
		imageUrls: ["https://images.unsplash.com/photo-1511193311914-0346f16efe90"],
		description:
			"秋葉原の中心部にあるポーカールーム。毎日様々なトーナメントを開催しており、常連から新規のお客様まで楽しめる空間です。",
		active: true,
		createdAt: Date.now() - Math.floor(Math.random() * 10000000),
		updatedAt: Date.now(),
	},
	{
		id: "6",
		name: "ポーカーハウス銀座",
		address: "東京都中央区銀座U-U-U 銀座プレミアムタワー 12F",
		area: "銀座",
		location: {
			latitude: 35.6721,
			longitude: 139.7636,
			geohash: "35.67_139.76",
		},
		hours: "平日 16:00-翌2:00 / 土日祝 14:00-翌2:00",
		fees: {
			entryFee: "¥4,000",
			entryFeeNumeric: 4000,
			chipRates: [
				{
					bbAmount: 300,
					price: 4000,
					pricePerBB: 13.33,
					description: "¥4,000 = $300",
				},
			],
			depositFees: [
				{
					threshold: 0,
					percentage: 4,
					description: "チップ額の4%",
				},
			],
			withdrawalFees: [
				{
					threshold: 0,
					percentage: 1,
					description: "チップ額の1%",
				},
			],
			feeNotes: "",
		},
		amenities: [
			"高級内装",
			"プロディーラー常駐",
			"VIPサービス",
			"マッチポット",
		],
		imageUrl: "https://images.unsplash.com/photo-1561631606-861551ea3ee3",
		imageUrls: ["https://images.unsplash.com/photo-1561631606-861551ea3ee3"],
		description:
			"銀座の一等地に位置する高級ポーカールーム。落ち着いた雰囲気の中で本格的なポーカーが楽しめます。接待にも最適。",
		active: true,
		createdAt: Date.now() - Math.floor(Math.random() * 10000000),
		updatedAt: Date.now(),
	},
	{
		id: uuidv4(),
		name: "Grand Poker Tokyo",
		address: "東京都港区高輪T-T-T グランドビル 8F",
		area: "品川",
		location: {
			latitude: 35.6284,
			longitude: 139.7387,
			geohash: "35.63_139.74",
		},
		hours: "毎日 15:00-翌5:00",
		fees: {
			entryFee: "¥3,500",
			entryFeeNumeric: 3500,
			chipRates: [
				{
					bbAmount: 50,
					price: 3000,
					pricePerBB: 60,
					description: "¥3,000 = 50BB",
				},
				{
					bbAmount: 100,
					price: 5000,
					pricePerBB: 50,
					description: "¥5,000 = 100BB",
				},
				{
					bbAmount: 200,
					price: 9000,
					pricePerBB: 45,
					description: "¥9,000 = 200BB",
				},
			],
			depositFees: [
				{
					threshold: 10000,
					percentage: 5,
					description: "〜¥10,000：5%",
				},
				{
					threshold: 50000,
					percentage: 3,
					description: "¥10,001〜¥50,000：3%",
				},
				{
					threshold: 100000,
					percentage: 2,
					description: "¥50,001以上：2%",
				},
			],
			withdrawalFees: [
				{
					threshold: 30000,
					percentage: 4,
					description: "〜¥30,000：4%",
				},
				{
					threshold: 100000,
					percentage: 2,
					description: "¥30,001以上：2%",
				},
			],
			feeNotes: "会員登録で入場料が¥500引きになります。",
		},
		amenities: [
			"会員制",
			"高級感",
			"英語対応",
			"トーナメント開催",
			"シングルテーブル",
			"サラリーマン割引",
		],
		imageUrl: "https://images.unsplash.com/photo-1566694271453-390536dd1f0d",
		imageUrls: [
			"https://images.unsplash.com/photo-1566694271453-390536dd1f0d",
			"https://images.unsplash.com/photo-1555053437-6220bc34e426",
		],
		description:
			"品川駅から徒歩8分。上質な空間で本格的なポーカーが楽しめます。初心者からプロまで対応したテーブルをご用意しています。",
		active: true,
		createdAt: Date.now() - 5000000,
		updatedAt: Date.now(),
	},
	{
		id: uuidv4(),
		name: "ポーカーパラダイス秋葉原",
		address: "東京都千代田区神田S-S-S 秋葉原センタービル 5F",
		area: "秋葉原",
		location: {
			latitude: 35.7022,
			longitude: 139.7741,
			geohash: "35.70_139.77",
		},
		hours: "平日 15:00-翌2:00 / 土日祝 12:00-翌3:00",
		fees: {
			entryFee: "¥2,200 (ドリンクバー付き)",
			entryFeeNumeric: 2200,
			chipRates: [
				{
					bbAmount: 50,
					price: 2500,
					pricePerBB: 50,
					description: "¥2,500 = 50BB",
				},
				{
					bbAmount: 100,
					price: 4500,
					pricePerBB: 45,
					description: "¥4,500 = 100BB",
				},
				{
					bbAmount: 300,
					price: 12000,
					pricePerBB: 40,
					description: "¥12,000 = 300BB",
				},
			],
			depositFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			withdrawalFees: [
				{
					threshold: 0,
					percentage: 0,
					description: "無料",
				},
			],
			feeNotes: "土日祝は入場料が+¥300となります。",
		},
		amenities: [
			"初心者歓迎",
			"女性割引",
			"Wi-Fi完備",
			"充電器貸出",
			"フードメニューあり",
		],
		imageUrl: "https://images.unsplash.com/photo-1556793198-7d25c5a9a6b3",
		imageUrls: [
			"https://images.unsplash.com/photo-1556793198-7d25c5a9a6b3",
			"https://images.unsplash.com/photo-1606167668584-78701c57f13d",
		],
		description:
			"秋葉原の中心部にある明るく開放的な雰囲気のポーカールーム。初心者講習も毎日開催！",
		active: true,
		createdAt: Date.now() - 8000000,
		updatedAt: Date.now() - 100000,
	},
];

// Mock favorites data storage (simulates database storage)
export const mockFavorites: string[] = ["1", "3", "5"];

// Areas for filtering
export const areas = [
	"渋谷",
	"新宿",
	"六本木",
	"池袋",
	"秋葉原",
	"銀座",
	"品川",
	"その他",
];

// Mock API functions
export const mockApi = {
	// Get store by ID
	getStoreById: async (id: string): Promise<ApiResponse<Store>> => {
		const store = mockStores.find((s) => s.id === id);

		if (!store) {
			return {
				error: "指定された会場が見つかりません",
			};
		}

		return {
			store,
		};
	},

	// Get all stores with filtering
	getStores: async (params: SearchParams): Promise<ApiResponse<Store>> => {
		let filteredStores = [...mockStores];

		// Basic filtering
		if (params.search) {
			const searchLower = params.search.toLowerCase();
			filteredStores = filteredStores.filter(
				(store) =>
					store.name.toLowerCase().includes(searchLower) ||
					store.address.toLowerCase().includes(searchLower) ||
					store.description.toLowerCase().includes(searchLower),
			);
		}

		if (params.area) {
			filteredStores = filteredStores.filter(
				(store) => store.area === params.area,
			);
		}

		// Fee filtering
		if (params.entryFeeMin !== undefined) {
			const entryFeeMin = params.entryFeeMin; // Local variable to avoid type error
			filteredStores = filteredStores.filter(
				(store) => store.fees.entryFeeNumeric >= entryFeeMin,
			);
		}

		if (params.entryFeeMax !== undefined) {
			const entryFeeMax = params.entryFeeMax; // Local variable to avoid type error
			filteredStores = filteredStores.filter(
				(store) => store.fees.entryFeeNumeric <= entryFeeMax,
			);
		}

		// Chip rate filtering
		if (
			params.chipRateMin !== undefined ||
			params.chipRateMax !== undefined ||
			params.bbAmount !== undefined
		) {
			const targetBB = params.bbAmount || 100;
			const chipRateMin = params.chipRateMin; // Local variable to avoid type error
			const chipRateMax = params.chipRateMax; // Local variable to avoid type error

			filteredStores = filteredStores.filter((store) => {
				// Find closest BB amount
				const rates = store.fees.chipRates;
				if (rates.length === 0) return false;

				const closestRate = rates.sort(
					(a, b) =>
						Math.abs(a.bbAmount - targetBB) - Math.abs(b.bbAmount - targetBB),
				)[0];

				const passesMin =
					chipRateMin === undefined || closestRate.pricePerBB >= chipRateMin;

				const passesMax =
					chipRateMax === undefined || closestRate.pricePerBB <= chipRateMax;

				return passesMin && passesMax;
			});
		}

		// Amenities filtering
		if (params.amenities && params.amenities.length > 0) {
			filteredStores = filteredStores.filter((store) =>
				params.amenities?.every((amenity) => store.amenities.includes(amenity)),
			);
		}

		// Sorting
		if (params.sort) {
			switch (params.sort) {
				case "name":
					filteredStores.sort((a, b) => {
						const result = a.name.localeCompare(b.name, "ja");
						return params.order === "desc" ? -result : result;
					});
					break;
				case "entryFee":
					filteredStores.sort((a, b) => {
						const result = a.fees.entryFeeNumeric - b.fees.entryFeeNumeric;
						return params.order === "desc" ? -result : result;
					});
					break;
				case "chipRate":
				case "chipRate100bb": {
					const targetBB = params.bbAmount || 100;
					filteredStores.sort((a, b) => {
						const rateA =
							a.fees.chipRates.sort(
								(x, y) =>
									Math.abs(x.bbAmount - targetBB) -
									Math.abs(y.bbAmount - targetBB),
							)[0]?.pricePerBB || 0;

						const rateB =
							b.fees.chipRates.sort(
								(x, y) =>
									Math.abs(x.bbAmount - targetBB) -
									Math.abs(y.bbAmount - targetBB),
							)[0]?.pricePerBB || 0;

						const result = rateA - rateB;
						return params.order === "desc" ? -result : result;
					});
					break;
				}
			}
		}

		// Pagination
		const limit = params.limit || 20;
		const startIndex = params.nextToken ? Number.parseInt(params.nextToken) : 0;
		const endIndex = Math.min(startIndex + limit, filteredStores.length);
		const paginatedStores = filteredStores.slice(startIndex, endIndex);

		const nextToken =
			endIndex < filteredStores.length ? endIndex.toString() : undefined;

		return {
			items: paginatedStores,
			totalCount: filteredStores.length,
			nextToken,
		};
	},

	// Get stores by area
	getStoresByArea: async (
		area: string,
		params: SearchParams,
	): Promise<ApiResponse<Store>> => {
		return await mockApi.getStores({ ...params, area });
	},

	// Get all areas
	getAreas: async (): Promise<{
		areas: string[];
		storeCountByArea: Record<string, number>;
	}> => {
		const storeCountByArea: Record<string, number> = {};

		// Count stores in each area
		for (const area of areas) {
			storeCountByArea[area] = mockStores.filter(
				(store) => store.area === area,
			).length;
		}

		return {
			areas,
			storeCountByArea,
		};
	},

	// Get stores near location
	getNearbyStores: async (
		params: NearbyParams,
	): Promise<ApiResponse<Store>> => {
		const { lat, lng, radius = 5, limit = 20, nextToken } = params;

		// Calculate distance between two points using Haversine formula
		const getDistanceFromLatLon = (
			lat1: number,
			lon1: number,
			lat2: number,
			lon2: number,
		): number => {
			const R = 6371; // Radius of the earth in km
			const dLat = ((lat2 - lat1) * Math.PI) / 180;
			const dLon = ((lon2 - lon1) * Math.PI) / 180;
			const a =
				Math.sin(dLat / 2) * Math.sin(dLat / 2) +
				Math.cos((lat1 * Math.PI) / 180) *
					Math.cos((lat2 * Math.PI) / 180) *
					Math.sin(dLon / 2) *
					Math.sin(dLon / 2);
			const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			const d = R * c; // Distance in km
			return d;
		};

		// Add distance to each store
		const storesWithDistance = mockStores.map((store) => {
			const distance = getDistanceFromLatLon(
				lat,
				lng,
				store.location.latitude,
				store.location.longitude,
			);

			return { ...store, distance };
		});

		// Filter by radius
		const filteredStores = storesWithDistance.filter(
			(store) => store.distance <= radius,
		);

		// Sort by distance
		filteredStores.sort((a, b) => (a.distance || 0) - (b.distance || 0));

		// Pagination
		const startIndex = nextToken ? Number.parseInt(nextToken) : 0;
		const endIndex = Math.min(startIndex + limit, filteredStores.length);
		const paginatedStores = filteredStores.slice(startIndex, endIndex);

		const nextTokenValue =
			endIndex < filteredStores.length ? endIndex.toString() : undefined;

		return {
			items: paginatedStores,
			nextToken: nextTokenValue,
		};
	},

	// Get stores in map bounds
	getStoresInBounds: async (
		params: BoundsParams,
	): Promise<ApiResponse<Store>> => {
		const { north, south, east, west, limit = 100, nextToken } = params;

		const filteredStores = mockStores.filter((store) => {
			const { latitude, longitude } = store.location;
			return (
				latitude <= north &&
				latitude >= south &&
				longitude <= east &&
				longitude >= west
			);
		});

		// Pagination
		const startIndex = nextToken ? Number.parseInt(nextToken) : 0;
		const endIndex = Math.min(startIndex + limit, filteredStores.length);
		const paginatedStores = filteredStores.slice(startIndex, endIndex);

		const nextTokenValue =
			endIndex < filteredStores.length ? endIndex.toString() : undefined;

		return {
			items: paginatedStores,
			nextToken: nextTokenValue,
		};
	},

	// ===== Favorites API =====

	// Get user's favorite stores
	getFavoriteStores: async (): Promise<FavoriteStoresResponse> => {
		const favoriteStoresList = mockStores
			.filter((store) => mockFavorites.includes(store.id))
			.map(
				(store) =>
					({
						id: store.id,
						name: store.name,
						area: store.area,
						sub_area: undefined,
						address: store.address,
						main_image_url: store.imageUrl,
						rating: 4.5, // Mock rating
						review_count: Math.floor(Math.random() * 50) + 5, // Mock review count
						latitude: store.location.latitude,
						longitude: store.location.longitude,
					}) as StorePreview,
			);

		return {
			stores: favoriteStoresList,
			total: favoriteStoresList.length,
		};
	},

	// Add a store to favorites
	addFavorite: async (
		request: AddFavoriteRequest,
	): Promise<AddFavoriteResponse> => {
		const { store_id } = request;

		// Check if store exists
		const storeExists = mockStores.some((store) => store.id === store_id);
		if (!storeExists) {
			return { success: false };
		}

		// Check if already in favorites
		if (!mockFavorites.includes(store_id)) {
			mockFavorites.push(store_id);
		}

		return { success: true };
	},

	// Remove a store from favorites
	removeFavorite: async (storeId: string): Promise<RemoveFavoriteResponse> => {
		const index = mockFavorites.indexOf(storeId);

		if (index !== -1) {
			mockFavorites.splice(index, 1);
			return { success: true };
		}

		return { success: false };
	},
};
