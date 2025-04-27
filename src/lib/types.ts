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
