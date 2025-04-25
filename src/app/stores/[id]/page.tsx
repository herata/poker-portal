"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useVisitedStores } from "@/lib/hooks";
import { type Store, getStoreById } from "@/lib/mockData";
import {
	ArrowLeft,
	CheckCircle,
	Clock,
	CreditCard,
	Info,
	MapPin,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const runtime = "edge";

export default function StoreDetailPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();
	const { id } = params;

	const [store, setStore] = useState<Store | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isClient, setIsClient] = useState(false);

	const { isVisited, toggleVisited } = useVisitedStores();

	useEffect(() => {
		setIsClient(true);

		if (id) {
			try {
				const fetchedStore = getStoreById(id as string);

				if (!fetchedStore) {
					console.error(`Store with id ${id} not found.`);
					setStore(null);
				} else {
					setStore(fetchedStore);
				}
			} catch (error) {
				console.error("Failed to fetch store data:", error);
				setStore(null);
			} finally {
				setIsLoading(false);
			}
		} else {
			console.error("ID parameter is missing.");
			setIsLoading(false);
		}
	}, [id]);

	const visited = isClient && store ? isVisited(store.id) : false;

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-6 md:py-8 text-center">
				読み込み中...
			</div>
		);
	}

	if (!store) {
		return (
			<div className="container mx-auto px-4 py-6 md:py-8 text-center">
				指定された会場が見つかりませんでした。
				<div className="mt-4">
					<Link href="/stores">
						<Button variant="outline">会場一覧に戻る</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			{/* Back Button */}
			<div className="mb-4 md:mb-6">
				<Link href="/stores">
					<Button
						variant="ghost"
						size="sm"
						className="gap-1 pl-0 hover:pl-2 transition-all -ml-2"
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="md:inline hidden">会場一覧に戻る</span>
						<span className="inline md:hidden">戻る</span>
					</Button>
				</Link>
			</div>

			{/* Mobile Header */}
			<div className="md:hidden mb-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold mb-2">{store.name}</h1>
					{isClient && (
						<Button
							variant={visited ? "default" : "outline"}
							size="sm"
							className={`gap-1 transition-colors ${
								visited ? "bg-green-600 hover:bg-green-700 text-white" : ""
							}`}
							onClick={() => toggleVisited(store.id)}
						>
							<CheckCircle className="h-4 w-4" />
							{visited ? "訪問済み" : "訪問する"}
						</Button>
					)}
				</div>
				<p className="text-muted-foreground text-sm">{store.address}</p>
			</div>

			{/* Image Gallery - Full width on mobile */}
			<div className="mb-6 md:hidden">
				<AspectRatio
					ratio={16 / 9}
					className="bg-muted overflow-hidden rounded-lg border"
				>
					{store.imageUrl ? (
						<img
							src={store.imageUrl}
							alt={store.name}
							className="object-cover w-full h-full"
							width={1600}
							height={900}
						/>
					) : (
						<div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
							画像準備中
						</div>
					)}
				</AspectRatio>
			</div>

			{/* Mobile Quick Info Bar */}
			<div className="md:hidden flex justify-between items-center border-b mb-6 pb-4 gap-4">
				<div className="flex items-center gap-1 flex-shrink min-w-0">
					<Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
					<span className="text-sm truncate">
						{store.hours ? store.hours.split("/")[0].trim() : "情報なし"}
					</span>
				</div>
				<div className="flex items-center gap-1 flex-shrink-0">
					<CreditCard className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm">{store.entryFee || "情報なし"}</span>
				</div>
			</div>

			{/* Desktop Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
				{/* Main Content - 2/3 width on desktop */}
				<div className="lg:col-span-2">
					{/* Desktop Header - Hidden on mobile */}
					<div className="hidden md:block mb-6">
						<div className="flex items-start justify-between">
							<div>
								<h1 className="text-3xl font-bold mb-2">{store.name}</h1>
								<p className="text-muted-foreground">{store.address}</p>
							</div>
							{isClient && (
								<Button
									variant={visited ? "default" : "outline"}
									size="sm"
									className={`gap-1 transition-colors ${
										visited ? "bg-green-600 hover:bg-green-700 text-white" : ""
									}`}
									onClick={() => toggleVisited(store.id)}
								>
									<CheckCircle className="h-4 w-4" />
									{visited ? "訪問済み" : "訪問する"}
								</Button>
							)}
						</div>
					</div>

					{/* Image Gallery - Hidden on mobile, visible on desktop */}
					<div className="mb-8 hidden md:block">
						<AspectRatio
							ratio={16 / 9}
							className="bg-muted overflow-hidden rounded-lg border"
						>
							{store.imageUrl ? (
								<img
									src={store.imageUrl}
									alt={store.name}
									className="object-cover w-full h-full"
									width={1600}
									height={900}
								/>
							) : (
								<div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
									画像準備中
								</div>
							)}
						</AspectRatio>
					</div>

					{/* Description */}
					<Card className="mb-6">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
								<Info className="h-5 w-5 text-muted-foreground" />
								会場の説明
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm md:text-base leading-relaxed">
								{store.description || "詳細情報は準備中です。"}
							</p>
						</CardContent>
					</Card>

					{/* Pricing Information Table */}
					<Card className="mb-6">
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
								<CreditCard className="h-5 w-5 text-muted-foreground" />
								料金情報
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[140px]">項目</TableHead>
											<TableHead>詳細</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className="font-medium">
												{" "}
												エントリーフィー{" "}
											</TableCell>
											<TableCell>{store.entryFee || "未定"}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">
												{" "}
												チップレート{" "}
											</TableCell>
											<TableCell>{store.chipRate || "未定"}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">入金手数料</TableCell>
											<TableCell>{store.depositFee || "未定"}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="font-medium">出金手数料</TableCell>
											<TableCell>{store.withdrawalFee || "未定"}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>

					{/* Amenities */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
								設備・特徴
							</CardTitle>
						</CardHeader>
						<CardContent>
							{store.amenities && store.amenities.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{store.amenities.map((amenity) => (
										<Badge
											key={amenity}
											variant="secondary"
											className="text-xs md:text-sm px-2.5 py-1"
										>
											{amenity}
										</Badge>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									特筆すべき設備・特徴はありません。
								</p>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Sidebar - 1/3 width on desktop */}
				<div className="lg:col-span-1 space-y-6 lg:space-y-8">
					{/* Hours */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-xl">
								<Clock className="h-5 w-5 text-muted-foreground" />
								営業時間
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm md:text-base">
								{store.hours || "情報なし"}
							</p>
						</CardContent>
					</Card>

					{/* Map Placeholder */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2 text-xl">
								<MapPin className="h-5 w-5 text-muted-foreground" />
								地図
							</CardTitle>
						</CardHeader>
						<CardContent>
							<AspectRatio ratio={4 / 3} className="bg-muted rounded-md border">
								<div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
									<p className="mb-1 text-sm">地図表示エリア</p>
									<p className="text-xs">住所: {store.address}</p>
									{store.latitude && store.longitude && (
										<p className="text-xs mt-1">
											座標: {store.latitude}, {store.longitude}
										</p>
									)}
									<Button
										variant="link"
										size="sm"
										className="mt-2 text-xs"
										asChild
									>
										<a
											href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											Google Mapsで見る
										</a>
									</Button>
								</div>
							</AspectRatio>
						</CardContent>
					</Card>

					{/* Contact Placeholder */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-xl">お問い合わせ</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								連絡先情報 (電話番号、ウェブサイトなど) は準備中です。
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Mobile Action Button (Fixed) */}
			<div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t p-4 shadow-lg">
				<Button className="w-full" size="lg" asChild>
					<a
						href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<MapPin className="mr-2 h-5 w-5" />
						地図アプリで開く
					</a>
				</Button>
			</div>
			<div className="pb-24 md:pb-0" />
		</div>
	);
}
