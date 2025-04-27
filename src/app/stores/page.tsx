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
import { useAreas, useFavoriteStores, useStores } from "@/lib/hooks";
import { CheckCircle, Filter, Loader2, Search, SortDesc } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// アメニティの選択肢を定義
const AMENITY_OPTIONS = [
	"初心者歓迎",
	"英語対応",
	"Wi-Fi完備",
	"フードメニューあり",
	"ドリンク飲み放題",
	"トーナメント開催",
	"初心者講習あり",
	"女性割引",
	"会員制",
	"高級感",
	"VIPルームあり",
];

// BBの選択肢を定義
const BB_AMOUNT_OPTIONS = [50, 100, 200, 300, 500];

// 並び替えの選択肢を定義
const SORT_OPTIONS = [
	{ value: "name_asc", label: "名前（昇順）" },
	{ value: "name_desc", label: "名前（降順）" },
	{ value: "entryFee_asc", label: "入場料（安い順）" },
	{ value: "entryFee_desc", label: "入場料（高い順）" },
	{ value: "chipRate_asc", label: "チップレート（安い順）" },
	{ value: "chipRate_desc", label: "チップレート（高い順）" },
];

export default function StoresPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedArea, setSelectedArea] = useState("all");
	const [showFilter, setShowFilter] = useState(false);
	const { value: visitedStores } = useFavoriteStores();
	const [mounted, setMounted] = useState(false);

	// 追加フィルター用のstate
	const [entryFeeMin, setEntryFeeMin] = useState<string>("");
	const [entryFeeMax, setEntryFeeMax] = useState<string>("");
	const [chipRateMin, setChipRateMin] = useState<string>("");
	const [chipRateMax, setChipRateMax] = useState<string>("");
	const [selectedBBAmount, setSelectedBBAmount] = useState<string>("100");
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState<string>("");

	// TanStack Queryを使用してデータを取得
	const { data: areasData, isLoading: areasLoading } = useAreas();

	// フィルター条件を構築
	const filterParams = {
		search: searchTerm,
		area: selectedArea !== "all" ? selectedArea : undefined,
		entryFeeMin: entryFeeMin ? Number(entryFeeMin) : undefined,
		entryFeeMax: entryFeeMax ? Number(entryFeeMax) : undefined,
		chipRateMin: chipRateMin ? Number(chipRateMin) : undefined,
		chipRateMax: chipRateMax ? Number(chipRateMax) : undefined,
		bbAmount: selectedBBAmount ? Number(selectedBBAmount) : undefined,
		amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
		sort: sortOption
			? (sortOption.split("_")[0] as "name" | "entryFee" | "chipRate")
			: undefined,
		order: sortOption
			? (sortOption.split("_")[1] as "asc" | "desc")
			: undefined,
	};

	const { data, isLoading } = useStores(filterParams);

	const stores = data?.items || [];
	const areas = areasData?.areas || [];

	// アメニティの選択を切り替える関数
	const toggleAmenity = (amenity: string) => {
		setSelectedAmenities((prev) =>
			prev.includes(amenity)
				? prev.filter((item) => item !== amenity)
				: [...prev, amenity],
		);
	};

	// フィルターをリセットする関数
	const resetFilters = () => {
		setSearchTerm("");
		setSelectedArea("all");
		setEntryFeeMin("");
		setEntryFeeMax("");
		setChipRateMin("");
		setChipRateMax("");
		setSelectedBBAmount("100");
		setSelectedAmenities([]);
		setSortOption("");
	};

	// Client-side hydration fix
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<h1 className="text-2xl md:text-3xl font-bold mb-6">条件で探す</h1>

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
				<div className="flex flex-col gap-3 p-3 bg-muted/50 rounded-md">
					{/* エリアフィルター */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<div className="flex flex-col w-full">
							<label htmlFor="area-select" className="text-sm font-medium mb-1">
								エリア
							</label>
							<Select
								value={selectedArea}
								onValueChange={setSelectedArea}
								disabled={areasLoading}
							>
								<SelectTrigger
									id="area-select"
									className="w-full bg-background"
								>
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

						{/* 入場料フィルター */}
						<div className="flex flex-col w-full">
							<label
								htmlFor="entry-fee-min"
								className="text-sm font-medium mb-1"
							>
								入場料
							</label>
							<div className="flex gap-2">
								<Input
									id="entry-fee-min"
									type="number"
									placeholder="最小"
									value={entryFeeMin}
									onChange={(e) => setEntryFeeMin(e.target.value)}
									className="w-full bg-background"
								/>
								<span className="flex items-center">-</span>
								<Input
									type="number"
									placeholder="最大"
									value={entryFeeMax}
									onChange={(e) => setEntryFeeMax(e.target.value)}
									className="w-full bg-background"
								/>
							</div>
						</div>

						{/* BBAmountの選択 */}
						<div className="flex flex-col w-full">
							<label htmlFor="bb-select" className="text-sm font-medium mb-1">
								BB数
							</label>
							<Select
								value={selectedBBAmount}
								onValueChange={setSelectedBBAmount}
							>
								<SelectTrigger id="bb-select" className="w-full bg-background">
									<SelectValue placeholder="BB数を選択" />
								</SelectTrigger>
								<SelectContent>
									{BB_AMOUNT_OPTIONS.map((bb) => (
										<SelectItem key={bb} value={bb.toString()}>
											{bb}BB
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* チップレートフィルター */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="flex flex-col w-full">
							<label
								htmlFor="chip-rate-min"
								className="text-sm font-medium mb-1"
							>
								チップレート（BB単価）
							</label>
							<div className="flex gap-2">
								<Input
									id="chip-rate-min"
									type="number"
									placeholder="最小"
									value={chipRateMin}
									onChange={(e) => setChipRateMin(e.target.value)}
									className="w-full bg-background"
								/>
								<span className="flex items-center">-</span>
								<Input
									type="number"
									placeholder="最大"
									value={chipRateMax}
									onChange={(e) => setChipRateMax(e.target.value)}
									className="w-full bg-background"
								/>
							</div>
						</div>

						{/* 並び替え */}
						<div className="flex flex-col w-full">
							<label htmlFor="sort-select" className="text-sm font-medium mb-1">
								並び替え
							</label>
							<Select value={sortOption} onValueChange={setSortOption}>
								<SelectTrigger
									id="sort-select"
									className="w-full bg-background"
								>
									<SelectValue placeholder="並び替え" />
								</SelectTrigger>
								<SelectContent>
									{SORT_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* アメニティフィルター */}
					<div className="w-full">
						<label
							htmlFor="amenities-section"
							className="text-sm font-medium mb-1"
						>
							アメニティ
						</label>
						<div id="amenities-section" className="flex flex-wrap gap-2 mt-1">
							{AMENITY_OPTIONS.map((amenity) => (
								<Badge
									key={amenity}
									variant={
										selectedAmenities.includes(amenity) ? "default" : "outline"
									}
									className="cursor-pointer hover:bg-muted"
									onClick={() => toggleAmenity(amenity)}
								>
									{amenity}
								</Badge>
							))}
						</div>
					</div>

					{/* フィルターリセットボタン */}
					<div className="flex justify-end mt-2">
						<Button
							onClick={resetFilters}
							variant="outline"
							className="w-full md:w-auto"
						>
							フィルターをリセット
						</Button>
					</div>
				</div>
			</div>

			{/* 選択中フィルターのサマリー表示 */}
			{(selectedArea !== "all" ||
				entryFeeMin ||
				entryFeeMax ||
				chipRateMin ||
				chipRateMax ||
				selectedBBAmount !== "100" ||
				selectedAmenities.length > 0 ||
				sortOption) && (
				<div className="mb-4 flex flex-wrap gap-2">
					{selectedArea !== "all" && (
						<Badge variant="secondary" className="flex items-center gap-1">
							エリア: {selectedArea}
							<button
								type="button"
								onClick={() => setSelectedArea("all")}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
					{(entryFeeMin || entryFeeMax) && (
						<Badge variant="secondary" className="flex items-center gap-1">
							入場料: {entryFeeMin || 0}円 - {entryFeeMax || "上限なし"}
							<button
								type="button"
								onClick={() => {
									setEntryFeeMin("");
									setEntryFeeMax("");
								}}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
					{selectedBBAmount !== "100" && (
						<Badge variant="secondary" className="flex items-center gap-1">
							BB数: {selectedBBAmount}BB
							<button
								type="button"
								onClick={() => setSelectedBBAmount("100")}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
					{(chipRateMin || chipRateMax) && (
						<Badge variant="secondary" className="flex items-center gap-1">
							BB単価: {chipRateMin || 0}円 - {chipRateMax || "上限なし"}
							<button
								type="button"
								onClick={() => {
									setChipRateMin("");
									setChipRateMax("");
								}}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
					{selectedAmenities.length > 0 &&
						selectedAmenities.map((amenity) => (
							<Badge
								key={amenity}
								variant="secondary"
								className="flex items-center gap-1"
							>
								{amenity}
								<button
									type="button"
									onClick={() => toggleAmenity(amenity)}
									className="ml-1 hover:text-destructive"
								>
									×
								</button>
							</Badge>
						))}
					{sortOption && (
						<Badge variant="secondary" className="flex items-center gap-1">
							並び替え:{" "}
							{SORT_OPTIONS.find((opt) => opt.value === sortOption)?.label}
							<button
								type="button"
								onClick={() => setSortOption("")}
								className="ml-1 hover:text-destructive"
							>
								×
							</button>
						</Badge>
					)}
				</div>
			)}

			{/* Loading State */}
			{isLoading && (
				<div className="text-center py-16">
					<Loader2 className="h-10 w-10 animate-spin mx-auto text-muted-foreground" />
					<p className="mt-4 text-muted-foreground">読み込み中...</p>
				</div>
			)}

			{/* Results Count */}
			{!isLoading && (
				<div className="mb-4 text-sm text-muted-foreground">
					{stores.length}件見つかりました
					{data?.totalCount &&
						data.totalCount > stores.length &&
						`（全${data.totalCount}件中）`}
				</div>
			)}

			{/* Grid Layout for Results */}
			{!isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{stores.map((store) => {
						const isVisited = mounted && visitedStores.includes(store.id);

						return (
							<Link
								href={`/stores/${store.id}`}
								key={store.id}
								className="block"
							>
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
										{/* 価格情報を追加 */}
										<div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mb-2">
											<div>
												<span className="font-medium">入場料: </span>
												{store.fees?.entryFee || "N/A"}
											</div>
											<div>
												<span className="font-medium">BB単価: </span>
												{store.fees?.chipRates &&
												store.fees.chipRates.length > 0
													? store.fees.chipRates.find(
															(rate) =>
																rate.bbAmount === Number(selectedBBAmount),
														)?.pricePerBB ||
														store.fees.chipRates[0]?.pricePerBB ||
														"N/A"
													: "N/A"}
												円
											</div>
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
			)}

			{/* No Results */}
			{!isLoading && stores.length === 0 && (
				<div className="text-center py-16">
					<p className="text-muted-foreground">該当する会場はありません</p>
					<Button variant="link" onClick={resetFilters}>
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
