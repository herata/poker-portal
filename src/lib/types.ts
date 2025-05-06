import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		idToken: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		idToken: string;
	}
}

export interface ChipRate {
	bbAmount: number;
	price: number;
	pricePerBB: number;
	description: string;
}

export interface FeeRate {
	threshold: number;
	percentage: number;
	description: string;
}

export interface Fees {
	entryFee: string;
	entryFeeNumeric: number;
	chipRates: ChipRate[];
	depositFees: FeeRate[];
	withdrawalFees: FeeRate[];
	feeNotes?: string;
}

export interface Location {
	latitude: number;
	longitude: number;
	geohash: string;
}

export interface Store {
	id: string;
	name: string;
	address: string;
	area: string;
	location: Location;
	hours: string;
	fees: Fees;
	amenities: string[];
	imageUrl: string;
	imageUrls?: string[];
	description: string;
	active: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface ApiResponse<T> {
	items?: T[];
	store?: T;
	error?: string;
	nextToken?: string;
	totalCount?: number;
}

export interface SearchParams {
	search?: string;
	area?: string;
	entryFeeMin?: number;
	entryFeeMax?: number;
	chipRateMin?: number;
	chipRateMax?: number;
	bbAmount?: number;
	depositFeeMax?: number;
	withdrawalFeeMax?: number;
	amenities?: string[];
	sort?: "name" | "entryFee" | "chipRate" | "chipRate100bb" | "distance";
	order?: "asc" | "desc";
	limit?: number;
	nextToken?: string;
}

export interface BoundsParams {
	north: number;
	south: number;
	east: number;
	west: number;
	limit?: number;
	nextToken?: string;
}

export interface NearbyParams {
	lat: number;
	lng: number;
	radius?: number;
	limit?: number;
	sort?: string;
	nextToken?: string;
}

// StorePreview interface from API specification
export interface StorePreview {
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

// Favorites API interfaces
export interface FavoriteStoresResponse {
	stores: StorePreview[];
	total: number;
	page?: number;
	limit?: number;
}

export interface AddFavoriteRequest {
	store_id: string;
}

export interface AddFavoriteResponse {
	success: boolean;
}

export interface RemoveFavoriteResponse {
	success: boolean;
}
