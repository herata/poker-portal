"use client";

import NearbyStoreMap from "@/components/NearbyStoreMap";
import { Button } from "@/components/ui/button";
import { mockStores } from "@/lib/mockData";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Convert mockStores data format to what NearbyStoreMap expects
const mapStores = mockStores.map((store) => ({
	id: store.id,
	name: store.name,
	address: store.address,
	lat: store.latitude,
	lng: store.longitude,
}));

export default function NearbyStoresPage() {
	const [currentLocation, setCurrentLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Get user's current location
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCurrentLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
					setIsLoading(false);
				},
				(error) => {
					console.error("Geolocation error:", error);
					setLocationError(
						"現在地を取得できませんでした。位置情報の許可設定をご確認ください。",
					);
					setIsLoading(false);
				},
			);
		} else {
			setLocationError("お使いのブラウザは位置情報の取得に対応していません。");
			setIsLoading(false);
		}
	}, []);

	// Calculate distance between two coordinates in km
	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	): number => {
		const R = 6371; // Radius of the earth in km
		const dLat = deg2rad(lat2 - lat1);
		const dLon = deg2rad(lon2 - lon1);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(lat1)) *
				Math.cos(deg2rad(lat2)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c; // Distance in km
		return distance;
	};

	const deg2rad = (deg: number): number => {
		return deg * (Math.PI / 180);
	};

	// Sort stores by distance if we have current location
	const sortedStores = currentLocation
		? [...mapStores].sort((a, b) => {
				const distA = calculateDistance(
					currentLocation.lat,
					currentLocation.lng,
					a.lat,
					a.lng,
				);
				const distB = calculateDistance(
					currentLocation.lat,
					currentLocation.lng,
					b.lat,
					b.lng,
				);
				return distA - distB;
			})
		: mapStores;

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<div className="flex items-center mb-6">
				<h1 className="text-2xl font-bold">近くの会場</h1>
			</div>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
					<p>現在地を取得しています...</p>
				</div>
			) : locationError ? (
				<>
					<div className="bg-destructive/10 text-destructive rounded-lg p-6 mb-6">
						<p className="mb-2 font-medium">{locationError}</p>
						<p className="text-sm">東京エリアの会場を表示しています。</p>
					</div>

					{/* Map Container - Show with default Tokyo location when error */}
					<div className="bg-muted rounded-lg overflow-hidden mb-6 h-[40vh] md:h-[50vh]">
						<NearbyStoreMap
							currentLocation={{ lat: 35.681, lng: 139.767 }} // Default to Tokyo when error
							stores={sortedStores}
						/>
					</div>
				</>
			) : (
				currentLocation && (
					/* Map Container - Only show when location is successfully fetched */
					<div className="bg-muted rounded-lg overflow-hidden mb-6 h-[40vh] md:h-[50vh]">
						<NearbyStoreMap
							currentLocation={currentLocation} // Safe access as it's checked before rendering
							stores={sortedStores}
						/>
					</div>
				)
			)}

			{/* Store List - Always show except when loading */}
			{!isLoading && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold mb-4">近くの会場一覧</h2>
					<div className="space-y-3">
						{sortedStores.map((store) => {
							// Calculate distance if we have current location
							const distance = currentLocation
								? calculateDistance(
										currentLocation.lat,
										currentLocation.lng,
										store.lat,
										store.lng,
									)
								: null;

							return (
								<div
									key={store.id}
									className="border rounded-lg p-4 hover:bg-muted/50 transition"
								>
									<div className="flex justify-between">
										<div>
											<h3 className="font-medium">{store.name}</h3>
											<p className="text-sm text-muted-foreground mt-1">
												{store.address}
											</p>
											{distance !== null && (
												<p className="text-xs text-primary mt-1">
													現在地から約{distance.toFixed(1)}km
												</p>
											)}
										</div>
										<Link href={`/stores/${store.id}`}>
											<Button size="sm">詳細を見る</Button>
										</Link>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
