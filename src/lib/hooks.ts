import { useQuery } from "@tanstack/react-query";
import {
	getAreas,
	getNearbyStores,
	getStoreById,
	getStores,
	getStoresByArea,
	getStoresByBBAmount,
	getStoresInMapBounds,
} from "./api";
import type { BoundsParams, NearbyParams, SearchParams } from "./types";
import { createLocalStorageStateHook } from "./utils";

// Create local storage hook for favorite stores (now used for both favorite and visited functionality)
const useFavoriteStoresStorage = createLocalStorageStateHook<string[]>(
	"favoriteStores",
	[],
);

// Custom hook for favorite stores (now used for both favorite and visited functionality)
export function useFavoriteStores() {
	// Using the created hook from createLocalStorageStateHook
	return useFavoriteStoresStorage();
}

// Custom hook to get venue list
export function useStores(params: SearchParams = {}) {
	return useQuery({
		queryKey: ["stores", params],
		queryFn: () => getStores(params),
	});
}

// Custom hook to get venues based on specific BB amount
export function useStoresByBBAmount(bbAmount = 100, params: SearchParams = {}) {
	return useQuery({
		queryKey: ["stores", "byBB", bbAmount, params],
		queryFn: () => getStoresByBBAmount(bbAmount, params),
	});
}

// Custom hook to get venue details
export function useStoreById(id: string | null) {
	return useQuery({
		queryKey: ["store", id],
		queryFn: () => {
			if (!id) throw new Error("Store ID is required");
			return getStoreById(id);
		},
		enabled: !!id, // Execute query only if ID exists
	});
}

// Custom hook to get venue list by area
export function useStoresByArea(
	area: string | null,
	params: SearchParams = {},
) {
	return useQuery({
		queryKey: ["stores", "byArea", area, params],
		queryFn: () => {
			if (!area) throw new Error("Area is required");
			return getStoresByArea(area, params);
		},
		enabled: !!area, // Execute query only if area exists
	});
}

// Custom hook to get list of areas
export function useAreas() {
	return useQuery({
		queryKey: ["areas"],
		queryFn: getAreas,
	});
}

// Custom hook to get nearby venues
export function useNearbyStores(params: NearbyParams | null) {
	return useQuery({
		queryKey: ["stores", "nearby", params],
		queryFn: () => {
			if (!params) throw new Error("Params are required");
			return getNearbyStores(params);
		},
		enabled: !!params && !!params.lat && !!params.lng, // Execute query only if parameters exist
	});
}

// Custom hook to get venues within map display bounds
export function useStoresInMapBounds(params: BoundsParams | null) {
	return useQuery({
		queryKey: ["stores", "inBounds", params],
		queryFn: () => {
			if (!params) throw new Error("Bounds params are required");
			return getStoresInMapBounds(params);
		},
		enabled:
			!!params &&
			!!params.north &&
			!!params.south &&
			!!params.east &&
			!!params.west, // Execute query only if bounds exist
	});
}
