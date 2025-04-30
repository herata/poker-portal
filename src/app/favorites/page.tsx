"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getStoreById } from "@/lib/api";
import { useFavoriteStores } from "@/lib/hooks";
import { useQueries } from "@tanstack/react-query";
import { BookmarkCheck, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const runtime = 'edge';

interface Store {
	id: string;
	name: string;
	address: string;
	imageUrl?: string;
	amenities: string[];
}

export default function MystoresPage() {
	const { value: favoriteStores, toggleId: toggleFavorite } =
		useFavoriteStores();
	const [mounted, setMounted] = useState(false);

	// Client-side hydration fix
	useEffect(() => {
		setMounted(true);
	}, []);

	// Use TanStack Query useQueries to fetch multiple store data in parallel
	const storeQueries = useQueries({
		queries: (mounted ? favoriteStores : []).map((id) => ({
			queryKey: ["store", id],
			queryFn: () => getStoreById(id),
			enabled: mounted && favoriteStores.length > 0,
		})),
	});

	// Check query status
	const isLoading = storeQueries.some((query) => query.isLoading);
	const isError = storeQueries.some((query) => query.isError);

	// Extract valid data
	const myFavoriteStores = storeQueries
		.filter((query) => query.data?.store)
		.map((query) => query.data?.store as Store);

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl md:text-3xl font-bold">お気に入り</h1>
			</div>

			{/* お気に入り読み込み中 */}
			{mounted && isLoading && (
				<div className="text-center py-16">
					<Loader2 className="h-10 w-10 animate-spin mx-auto text-muted-foreground mb-4" />
					<p className="text-muted-foreground">お気に入りを読み込み中...</p>
				</div>
			)}

			{/* エラー状態 */}
			{mounted && isError && !isLoading && (
				<div className="text-center py-16 border rounded-lg bg-destructive/10">
					<p className="text-sm text-muted-foreground mt-2">
						時間をおいて再度お試しください。
					</p>
				</div>
			)}

			{/* お気に入り店舗がある場合 */}
			{mounted && !isLoading && myFavoriteStores.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{myFavoriteStores.map(
						(store) =>
							store && (
								<Card key={store.id} className="h-full">
									<CardHeader className="pb-3">
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-xl line-clamp-1">
													{store.name}
												</CardTitle>
												<CardDescription className="line-clamp-1">
													{store.address}
												</CardDescription>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="text-red-500 hover:text-red-700 hover:bg-red-50"
												onClick={(e) => {
													e.preventDefault();
													toggleFavorite(store.id);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</CardHeader>
									<CardContent className="pb-3">
										<Link href={`/stores/${store.id}`} className="block">
											<AspectRatio
												ratio={4 / 3}
												className="bg-muted overflow-hidden rounded-md mb-3"
											>
												{store.imageUrl ? (
													<img
														src={store.imageUrl}
														alt={store.name}
														className="object-cover w-full h-full"
													/>
												) : (
													<div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
														No Image
													</div>
												)}
											</AspectRatio>
										</Link>
										<div className="text-sm text-muted-foreground mb-2">
											<div className="flex items-center gap-1 mb-1">
												<BookmarkCheck className="h-4 w-4 text-green-600" />
												<span>お気に入り</span>
											</div>
										</div>
										<div className="flex flex-wrap gap-1">
											{store.amenities.slice(0, 3).map((amenity: string) => (
												<Badge
													key={amenity}
													variant="secondary"
													className="text-xs"
												>
													{amenity}
												</Badge>
											))}
										</div>
									</CardContent>
									<CardFooter>
										<Link href={`/stores/${store.id}`} className="w-full">
											<Button variant="outline" className="w-full">
												詳細を見る
											</Button>
										</Link>
									</CardFooter>
								</Card>
							),
					)}
				</div>
			)}

			{/* お気に入り店舗がない場合 */}
			{mounted &&
				!isLoading &&
				(favoriteStores.length === 0 || myFavoriteStores.length === 0) && (
					<div className="text-center py-16 border rounded-lg bg-muted/30">
						<BookmarkCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h2 className="text-xl font-semibold mb-2">
							お気に入りはありません
						</h2>
						<Link href="/stores">
							<Button>条件で探す</Button>
						</Link>
					</div>
				)}
		</div>
	);
}
