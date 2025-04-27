import { mockApi } from "./mockData";
import type {
	ApiResponse,
	BoundsParams,
	NearbyParams,
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
