"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addFavoriteStore,
	getAreas,
	getFavoriteStores,
	getNearbyStores,
	getStoreById,
	getStores,
	getStoresByArea,
	getStoresByBBAmount,
	getStoresInMapBounds,
	removeFavoriteStore,
} from "./api";
import type { BoundsParams, NearbyParams, SearchParams } from "./types";

// Custom hook for favorite stores using the server API
export function useFavoriteStoresApi() {
	const queryClient = useQueryClient();

	// Query to get favorites from API
	const favoritesQuery = useQuery({
		queryKey: ["favorites"],
		queryFn: () => getFavoriteStores(),
	});

	// Mutation to add a favorite
	const addFavoriteMutation = useMutation({
		mutationFn: (storeId: string) => addFavoriteStore(storeId),
		onSuccess: () => {
			// Invalidate the favorites query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});

	// Mutation to remove a favorite
	const removeFavoriteMutation = useMutation({
		mutationFn: (storeId: string) => removeFavoriteStore(storeId),
		onSuccess: () => {
			// Invalidate the favorites query to trigger a refetch
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});

	return {
		favorites: favoritesQuery.data?.stores || [],
		totalCount: favoritesQuery.data?.total || 0,
		isLoading: favoritesQuery.isLoading,
		isError: favoritesQuery.isError,
		addFavorite: addFavoriteMutation.mutate,
		removeFavorite: removeFavoriteMutation.mutate,
		isAddingFavorite: addFavoriteMutation.isPending,
		isRemovingFavorite: removeFavoriteMutation.isPending,
	};
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
