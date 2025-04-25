"use client";

import { useState } from "react";

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

export default function NearbyStoreMap({
	currentLocation,
	stores,
}: NearbyStoreMapProps) {
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);

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
			{/* Mock map background */}
			<div className="absolute inset-0 opacity-50">
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
					<button
						type="button"
						className="absolute top-1 right-1 text-xs"
						onClick={() => setSelectedStore(null)}
					>
						✕
					</button>
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

			{/* Mock map controls */}
			<div className="absolute top-2 right-2 bg-white rounded shadow-md p-2 flex flex-col">
				<button
					type="button"
					className="mb-1 w-6 h-6 flex items-center justify-center text-lg"
				>
					+
				</button>
				<button
					type="button"
					className="w-6 h-6 flex items-center justify-center text-lg"
				>
					−
				</button>
			</div>

			<div className="absolute bottom-2 left-2 bg-white/80 text-xs text-gray-500 px-2 py-1 rounded">
				Mock Map - 現在地を中心に表示
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
