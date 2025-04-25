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
import { useVisitedStores } from "@/lib/hooks";
import { mockStores } from "@/lib/mockData";
import { ArrowLeft, BookmarkCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MystoresPage() {
	const { visitedStores, toggleVisited } = useVisitedStores();
	const [mounted, setMounted] = useState(false);

	// Client-side hydration fix
	useEffect(() => {
		setMounted(true);
	}, []);

	// Get visited store details
	const myVisitedStores = mounted
		? mockStores.filter((store) => visitedStores.includes(store.id))
		: [];

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl md:text-3xl font-bold">訪問済みの会場</h1>
			</div>

			{myVisitedStores.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{myVisitedStores.map((store) => (
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
											toggleVisited(store.id);
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
										<span>訪問済み</span>
									</div>
								</div>
								<div className="flex flex-wrap gap-1">
									{store.amenities.slice(0, 3).map((amenity) => (
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
					))}
				</div>
			) : (
				<div className="text-center py-16 border rounded-lg bg-muted/30">
					<BookmarkCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">
						まだ訪問した会場はありません
					</h2>
					<p className="text-muted-foreground mb-6">
						会場を訪問すると、ここに表示されます
					</p>
					<Link href="/stores">
						<Button>会場を探す</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
