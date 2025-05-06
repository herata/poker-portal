import { mockApi } from "./mockData";
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
} from "./types";

// Get venue list (with filtering and sorting capabilities)
export async function getStores(
	params: SearchParams = {},
): Promise<ApiResponse<Store>> {
	// Use mock API
	return await mockApi.getStores(params);
}

// Search and sort venues based on specific BB amount
export async function getStoresByBBAmount(
	bbAmount = 100,
	params: SearchParams = {},
): Promise<ApiResponse<Store>> {
	return await mockApi.getStores({
		...params,
		bbAmount,
		sort: "chipRate100bb",
	});
}

// Get venue details
export async function getStoreById(id: string): Promise<ApiResponse<Store>> {
	return await mockApi.getStoreById(id);
}

// Get venue list by area
export async function getStoresByArea(
	area: string,
	params: SearchParams = {},
): Promise<ApiResponse<Store>> {
	return await mockApi.getStoresByArea(area, params);
}

// Get list of areas
export async function getAreas(): Promise<{
	areas: string[];
	storeCountByArea: Record<string, number>;
}> {
	return await mockApi.getAreas();
}

// Get venues near current location
export async function getNearbyStores(
	params: NearbyParams,
): Promise<ApiResponse<Store>> {
	return await mockApi.getNearbyStores(params);
}

// Get venues within map display bounds
export async function getStoresInMapBounds(
	params: BoundsParams,
): Promise<ApiResponse<Store>> {
	return await mockApi.getStoresInBounds(params);
}

// ===== Favorites API functions =====

// Get user's favorite stores
export async function getFavoriteStores(): Promise<FavoriteStoresResponse> {
	return await mockApi.getFavoriteStores();
}

// Add a store to favorites
export async function addFavoriteStore(
	storeId: string,
): Promise<AddFavoriteResponse> {
	return await mockApi.addFavorite({ store_id: storeId });
}

// Remove a store from favorites
export async function removeFavoriteStore(
	storeId: string,
): Promise<RemoveFavoriteResponse> {
	return await mockApi.removeFavorite(storeId);
}
