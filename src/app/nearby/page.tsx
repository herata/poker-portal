"use client";

import NearbyStoreMap from "@/components/NearbyStoreMap";
import { Button } from "@/components/ui/button";
import { useNearbyStores } from "@/lib/hooks";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const runtime = "edge";

export default function NearbyStoresPage() {
	const [currentLocation, setCurrentLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [locationError, setLocationError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch nearby stores using TanStack Query
	const { data, isLoading: storesLoading } = useNearbyStores(
		currentLocation
			? {
					lat: currentLocation.lat,
					lng: currentLocation.lng,
					radius: 10, // Within 10km radius
					limit: 20,
				}
			: null,
	);

	const nearbyStores = data?.items || [];

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

	// Format store data for map component
	const mapStores = nearbyStores.map((store) => ({
		id: store.id,
		name: store.name,
		address: store.address,
		lat: store.location.latitude,
		lng: store.location.longitude,
		distance:
			"distance" in store ? (store.distance as number | string) : undefined, // Use if included in API response
	}));

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<div className="flex items-center mb-6">
				<h1 className="text-2xl font-bold">地図で探す</h1>
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
							stores={mapStores}
						/>
					</div>
				</>
			) : (
				currentLocation && (
					/* Map Container - Only show when location is successfully fetched */
					<div className="bg-muted rounded-lg overflow-hidden mb-6 h-[40vh] md:h-[50vh]">
						<NearbyStoreMap
							currentLocation={currentLocation}
							stores={mapStores}
						/>
					</div>
				)
			)}

			{/* Store List - Loading State */}
			{!isLoading && storesLoading && (
				<div className="flex flex-col items-center justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
					<p className="text-sm text-muted-foreground">データ読み込み中...</p>
				</div>
			)}

			{/* Store List - Results */}
			{!isLoading && !storesLoading && (
				<div className="mt-8">
					<h2 className="text-xl font-semibold mb-4">一覧</h2>
					{nearbyStores.length > 0 ? (
						<div className="space-y-3">
							{nearbyStores.map((store) => {
								// Use distance property if returned from API
								const distance =
									"distance" in store
										? (store.distance as number | string)
										: undefined;

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
												{distance !== undefined && (
													<p className="text-xs text-primary mt-1">
														現在地から約
														{typeof distance === "number"
															? distance.toFixed(1)
															: distance}
														km
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
					) : (
						<div className="text-center py-8 bg-muted rounded-lg">
							<p className="text-muted-foreground">
								近くに見つかりませんでした
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								検索範囲を広げるか、別の場所をお試しください
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
