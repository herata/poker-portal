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
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useVisitedStores } from "@/lib/hooks";
import { areas, mockStores } from "@/lib/mockData";
import { CheckCircle, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StoresPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedArea, setSelectedArea] = useState("all"); // Changed from "" to "all"
	const [showFilter, setShowFilter] = useState(false);
	const { visitedStores } = useVisitedStores();
	const [mounted, setMounted] = useState(false);

	// Client-side hydration fix
	useEffect(() => {
		setMounted(true);
	}, []);

	// Filter stores based on search term and selected area
	const filteredStores = mockStores.filter((store) => {
		const matchesSearch =
			store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
			store.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			false;
		const matchesArea = selectedArea === "all" || store.area === selectedArea; // Changed from "" to "all"
		return matchesSearch && matchesArea;
	});

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<h1 className="text-2xl md:text-3xl font-bold mb-6">ポーカー会場一覧</h1>

			{/* Search Section - Always visible */}
			<div className="flex gap-2 mb-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="会場名、住所、キーワード"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-9 w-full"
					/>
				</div>
				<Button
					variant="outline"
					size="icon"
					onClick={() => setShowFilter(!showFilter)}
					className="md:hidden"
				>
					<Filter className="h-4 w-4" />
				</Button>
			</div>

			{/* Filter Section - Collapsible on mobile, always visible on desktop */}
			<div className={`${showFilter ? "block" : "hidden"} md:block mb-6`}>
				<div className="flex flex-col md:flex-row gap-3 p-3 bg-muted/50 rounded-md">
					<div className="flex flex-col w-full">
						<label htmlFor="area-select" className="text-sm font-medium mb-1">
							エリア
						</label>
						<Select value={selectedArea} onValueChange={setSelectedArea}>
							<SelectTrigger id="area-select" className="w-full bg-background">
								<SelectValue placeholder="全てのエリア" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">全てのエリア</SelectItem>
								{areas.map((area) => (
									<SelectItem key={area} value={area}>
										{area}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-end">
						<Button
							onClick={() => {
								setSearchTerm("");
								setSelectedArea("all"); // Changed from "" to "all"
							}}
							variant="outline"
							className="w-full md:w-auto"
						>
							リセット
						</Button>
					</div>
				</div>
			</div>

			{/* Results Count */}
			<div className="mb-4 text-sm text-muted-foreground">
				{filteredStores.length}件の会場が見つかりました
			</div>

			{/* Grid Layout for Results */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{filteredStores.map((store) => {
					const isVisited = mounted && visitedStores.includes(store.id);

					return (
						<Link href={`/stores/${store.id}`} key={store.id} className="block">
							<Card className="h-full hover:shadow-lg transition-shadow">
								<CardHeader className="pb-3 relative">
									{isVisited && (
										<div className="absolute top-2 right-2">
											<Badge variant="default" className="bg-green-600">
												<CheckCircle className="h-3 w-3 mr-1" />
												訪問済み
											</Badge>
										</div>
									)}
									<CardTitle className="text-xl line-clamp-1">
										{store.name}
									</CardTitle>
									<CardDescription className="line-clamp-1">
										{store.address}
									</CardDescription>
								</CardHeader>
								<CardContent className="pb-3">
									<div className="mb-3">
										<AspectRatio
											ratio={4 / 3}
											className="bg-muted overflow-hidden rounded-md"
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
									</div>
									<div className="flex flex-wrap gap-1 mt-2">
										{store.amenities.slice(0, 3).map((amenity) => (
											<Badge
												key={amenity}
												variant="secondary"
												className="text-xs"
											>
												{amenity}
											</Badge>
										))}
										{store.amenities.length > 3 && (
											<Badge variant="outline" className="text-xs">
												+{store.amenities.length - 3}
											</Badge>
										)}
									</div>
								</CardContent>
								<CardFooter>
									<div className="text-xs text-muted-foreground line-clamp-1">
										営業時間: {store.hours}
									</div>
								</CardFooter>
							</Card>
						</Link>
					);
				})}
			</div>

			{/* No Results */}
			{filteredStores.length === 0 && (
				<div className="text-center py-16">
					<p className="text-muted-foreground">該当する会場はありません</p>
					<Button
						variant="link"
						onClick={() => {
							setSearchTerm("");
							setSelectedArea("all"); // Changed from "" to "all"
						}}
					>
						検索条件をリセット
					</Button>
				</div>
			)}

			{/* Map View Placeholder - Hidden on small screens, visible on medium+ */}
			<div className="mt-8 md:mt-12 border rounded-lg p-4 hidden md:block">
				<h2 className="text-xl font-semibold mb-4">会場マップ</h2>
				<AspectRatio ratio={16 / 9} className="bg-muted rounded-md border">
					<div className="w-full h-full flex items-center justify-center text-muted-foreground">
						Map View (Google Maps will be integrated here)
					</div>
				</AspectRatio>
			</div>

			{/* Mobile Map Toggle Button */}
			<div className="fixed bottom-6 right-6 md:hidden">
				<Button className="rounded-full shadow-lg h-12 w-12 p-0">
					<Filter className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
