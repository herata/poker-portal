"use client";

import {
	APIProvider,
	AdvancedMarker,
	Map as GoogleMap,
	InfoWindow,
	Pin,
	useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import React, { useRef, useState } from "react";

// Define types for props
type Store = {
	id: string;
	name: string;
	address: string;
	lat: number;
	lng: number;
};

type NearbyStoreMapProps = {
	currentLocation: {
		lat: number;
		lng: number;
	};
	stores: Store[];
};

// Map container style
const containerStyle = {
	width: "100%",
	height: "100%",
};

export default function NearbyStoreMap({
	currentLocation,
	stores,
}: NearbyStoreMapProps) {
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const mapRef = useRef<google.maps.Map | null>(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [mapError, setMapError] = useState<string | null>(null);
	const [errorDetails, setErrorDetails] = useState<string | null>(null);
	const [initialMapSetupDone, setInitialMapSetupDone] = useState(false);

	// Try to use the development API key and Map ID if in development mode
	const isDev = process.env.NODE_ENV === "development";
	const apiKey =
		process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
		(isDev ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_DEV_API_KEY : "") ||
		"";
	const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "";

	// Set appropriate zoom level based on nearest store
	const calculateZoomLevel = () => {
		if (stores.length === 0) return 14;

		let nearestDistance = Number.MAX_VALUE;
		for (const store of stores) {
			const distance = calculateDistance(
				currentLocation.lat,
				currentLocation.lng,
				store.lat,
				store.lng,
			);
			if (distance < nearestDistance) {
				nearestDistance = distance;
			}
		}

		// Set zoom level based on distance to nearest store
		if (nearestDistance > 10) return 10; // Far away: zoom out
		if (nearestDistance > 5) return 11;
		if (nearestDistance > 2) return 12;
		if (nearestDistance > 1) return 13;
		return 14; // Close by: zoom in
	};

	// Modified map camera handler to only set up the map once
	const handleMapCamera = (event: { map: google.maps.Map }) => {
		if (!mapLoaded && event.map) {
			mapRef.current = event.map;
			setMapLoaded(true);

			// Only fit bounds and center the first time the map loads
			if (!initialMapSetupDone && stores.length > 1) {
				const bounds = new google.maps.LatLngBounds();
				bounds.extend({ lat: currentLocation.lat, lng: currentLocation.lng });
				for (const store of stores) {
					bounds.extend({ lat: store.lat, lng: store.lng });
				}
				event.map.fitBounds(bounds);
				setInitialMapSetupDone(true);
			}
		}
	};

	const handleMapError = (error: unknown) => {
		console.error("Google Maps API error:", error);

		// Check for specific error types
		if (error instanceof Error) {
			if (error.message?.includes("ApiTargetBlockedMapError")) {
				setMapError(
					"APIキーに制限が設定されています。開発環境での使用が制限されている可能性があります。",
				);
				setErrorDetails(
					"APIキーがドメイン制限されており、localhost/開発環境では使用できません。開発用APIキーを設定するか、制限を緩和してください。",
				);
			} else if (error.message?.includes("Map ID")) {
				setMapError("Map IDが設定されていないか、無効です。");
				setErrorDetails(
					"高度なマーカーを使用するためには、有効なMap IDが必要です。",
				);
			} else {
				setMapError(
					"地図の読み込みに失敗しました。APIキーを確認してください。",
				);
			}
		} else {
			setMapError("地図の読み込みに失敗しました。APIキーを確認してください。");
		}
	};

	// If we have no API key or there was an error, use the mock map instead
	if (!apiKey || mapError) {
		return (
			<MockMap
				currentLocation={currentLocation}
				stores={stores}
				selectedStore={selectedStore}
				setSelectedStore={setSelectedStore}
				errorMessage={mapError}
				errorDetails={errorDetails}
			/>
		);
	}

	return (
		<APIProvider apiKey={apiKey} onError={handleMapError}>
			<div className="relative w-full h-full">
				<GoogleMap
					style={containerStyle}
					center={initialMapSetupDone ? undefined : currentLocation}
					zoom={initialMapSetupDone ? undefined : calculateZoomLevel()}
					defaultZoom={14}
					defaultCenter={currentLocation}
					onCameraChanged={handleMapCamera}
					fullscreenControl={false}
					mapTypeControl={false}
					streetViewControl={false}
					zoomControl={true}
					mapId={mapId}
					gestureHandling="greedy"
				>
					{mapLoaded && (
						<>
							{/* Current location marker using AdvancedMarker */}
							<AdvancedMarker position={currentLocation} title="現在地">
								<Pin
									background="#4285F4"
									borderColor="#FFFFFF"
									glyphColor="#FFFFFF"
									scale={1}
								/>
							</AdvancedMarker>

							{/* Store markers using AdvancedMarker */}
							{stores.map((store) => (
								<StoreMarkerWithInfoWindow
									key={store.id}
									store={store}
									isSelected={selectedStore?.id === store.id}
									onSelect={setSelectedStore}
									onClose={() => setSelectedStore(null)}
									currentLocation={currentLocation}
								/>
							))}
						</>
					)}
				</GoogleMap>
			</div>
		</APIProvider>
	);
}

// Separate component for store marker with infowindow
function StoreMarkerWithInfoWindow({
	store,
	isSelected,
	onSelect,
	onClose,
	currentLocation,
}: {
	store: Store;
	isSelected: boolean;
	onSelect: (store: Store) => void;
	onClose: () => void;
	currentLocation: { lat: number; lng: number };
}) {
	const [markerRef, marker] = useAdvancedMarkerRef();

	return (
		<>
			<AdvancedMarker
				ref={markerRef}
				position={{ lat: store.lat, lng: store.lng }}
				onClick={() => onSelect(store)}
				title={store.name}
			>
				<Pin
					background="#DB4437"
					borderColor="#FFFFFF"
					glyphColor="#FFFFFF"
					scale={0.9}
				/>
			</AdvancedMarker>

			{isSelected && marker && (
				<InfoWindow
					anchor={marker}
					maxWidth={250}
					onCloseClick={onClose}
					pixelOffset={[0, -5]}
				>
					<div className="p-3 bg-white rounded shadow-sm">
						<div className="border-b pb-2 mb-2">
							<h2 className="font-bold text-sm">{store.name}</h2>
						</div>
						<p className="text-xs text-gray-600 mb-2">{store.address}</p>
					</div>
				</InfoWindow>
			)}
		</>
	);
}

// Mock map component to use when Google Maps API is unavailable
function MockMap({
	currentLocation,
	stores,
	selectedStore,
	setSelectedStore,
	errorMessage,
	errorDetails,
}: {
	currentLocation: { lat: number; lng: number };
	stores: Store[];
	selectedStore: Store | null;
	setSelectedStore: (store: Store | null) => void;
	errorMessage: string | null;
	errorDetails: string | null;
}) {
	// Calculate boundaries for the mock map display with current location always at the center
	const mapBoundaries = calculateMapBoundariesWithCenter(
		currentLocation,
		stores.map((s) => ({ lat: s.lat, lng: s.lng })),
	);

	// Convert coordinates to pixel positions for the mock map
	const getPositionOnMap = (lat: number, lng: number) => {
		const { minLat, maxLat, minLng, maxLng } = mapBoundaries;

		// Add padding to avoid markers at the very edge
		const paddingPercent = 0.1;
		const mapWidth = 100 - paddingPercent * 200;
		const mapHeight = 100 - paddingPercent * 200;

		// Calculate position as percentage (with padding)
		const x =
			((lng - minLng) / (maxLng - minLng)) * mapWidth + paddingPercent * 100;
		const y =
			(1 - (lat - minLat) / (maxLat - minLat)) * mapHeight +
			paddingPercent * 100;

		return { x, y };
	};

	return (
		<div className="h-full w-full relative bg-slate-100">
			{/* Map error notification */}
			<div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 text-center text-sm z-30">
				{errorMessage ||
					"Google Maps APIが利用できないため、簡易マップを表示しています"}
				{errorDetails && (
					<div className="text-xs mt-1 text-yellow-700">{errorDetails}</div>
				)}
				{process.env.NODE_ENV === "development" && (
					<div className="text-xs mt-1">
						開発者向け: <code>.env.local</code> ファイルに{" "}
						<code>NEXT_PUBLIC_GOOGLE_MAPS_DEV_API_KEY</code> と{" "}
						<code>NEXT_PUBLIC_GOOGLE_MAPS_ID</code> を設定してください
					</div>
				)}
			</div>

			{/* Mock map background - adjusted to make room for the larger error message */}
			<div className="absolute inset-0 opacity-50 mt-16">
				{/* Grid lines to simulate map */}
				<div className="grid grid-cols-8 grid-rows-8 h-full w-full">
					{Array.from({ length: 64 }).map((_, i) => {
						const row = Math.floor(i / 8);
						const col = i % 8;
						return (
							<div
								key={`grid-${row}-${col}`}
								className="border border-slate-300"
							/>
						);
					})}
				</div>
			</div>

			{/* Current location marker - now centered on the map */}
			<div
				className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 z-20"
				style={{
					left: "50%",
					top: "50%",
				}}
				title="現在地"
			/>

			{/* "You are here" label */}
			<div
				className="absolute bg-white/90 px-2 py-1 rounded shadow-sm text-xs font-medium transform -translate-x-1/2 z-20"
				style={{
					left: "50%",
					top: "calc(50% + 10px)",
				}}
			>
				現在地
			</div>

			{/* Store markers */}
			{stores.map((store) => {
				const { x, y } = getPositionOnMap(store.lat, store.lng);
				return (
					<div
						key={store.id}
						className="absolute w-4 h-4 bg-red-500 rounded-full border border-white transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform z-10"
						style={{ left: `${x}%`, top: `${y}%` }}
						title={store.name}
						onClick={() => setSelectedStore(store)}
						onKeyUp={(e) => e.key === "Enter" && setSelectedStore(store)}
						tabIndex={0}
						role="button"
						aria-label={`Show details for ${store.name}`}
					/>
				);
			})}

			{/* Info window for selected store */}
			{selectedStore && (
				<div
					className="absolute bg-white p-3 rounded-lg shadow-lg z-30"
					style={{
						left: `${getPositionOnMap(selectedStore.lat, selectedStore.lng).x}%`,
						top: `${getPositionOnMap(selectedStore.lat, selectedStore.lng).y - 5}%`,
						transform: "translate(-50%, -100%)",
					}}
				>
					<h3 className="font-bold text-sm">{selectedStore.name}</h3>
					<p className="text-xs text-gray-600 mt-1">{selectedStore.address}</p>
					<p className="text-xs text-primary-600 mt-1">
						現在地から{" "}
						{calculateDistance(
							currentLocation.lat,
							currentLocation.lng,
							selectedStore.lat,
							selectedStore.lng,
						).toFixed(1)}{" "}
						km
					</p>
				</div>
			)}

			<div className="absolute bottom-2 left-2 bg-white/80 text-xs text-gray-500 px-2 py-1 rounded">
				簡易マップ - 現在地を中心に表示
			</div>
		</div>
	);
}

// Helper function to calculate map boundaries with current location at the center
function calculateMapBoundariesWithCenter(
	center: { lat: number; lng: number },
	locations: Array<{ lat: number; lng: number }>,
) {
	// Calculate the max distance from center to any location
	let maxDistance = 0;
	for (const loc of locations) {
		const latDiff = Math.abs(loc.lat - center.lat);
		const lngDiff = Math.abs(loc.lng - center.lng);
		maxDistance = Math.max(maxDistance, latDiff, lngDiff);
	}

	// If no locations or all locations are same as center, set a default view distance
	if (maxDistance === 0) {
		maxDistance = 0.01; // Small default viewable area
	} else {
		// Add some extra space
		maxDistance *= 2;
	}

	return {
		minLat: center.lat - maxDistance,
		maxLat: center.lat + maxDistance,
		minLng: center.lng - maxDistance,
		maxLng: center.lng + maxDistance,
	};
}

// Calculate distance between two coordinates in km
function calculateDistance(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number {
	const R = 6371; // Radius of the Earth in km
	const dLat = deg2rad(lat2 - lat1);
	const dLng = deg2rad(lat2 - lng1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) *
			Math.cos(deg2rad(lat2)) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in km
}

function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}
