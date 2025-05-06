import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getFavoriteStores } from "@/lib/api";
import { BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { removeFavoriteAction } from "../actions/favorites";

// Server component
export const runtime = "edge";

export default async function FavoriteStoresPage() {
	// Fetch favorite stores directly from the server
	const { stores: favoriteStores = [], total = 0 } = await getFavoriteStores();

	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl md:text-3xl font-bold">お気に入り</h1>
			</div>

			{/* お気に入り店舗がある場合 */}
			{favoriteStores.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{favoriteStores.map((store) => (
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
									<form
										action={removeFavoriteAction.bind(null, store.id)}
									>
										<Button
											type="submit"
											variant="ghost"
											size="icon"
											className="text-red-500 hover:text-red-700 hover:bg-red-50"
										>
											<span className="sr-only">削除</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="16"
												height="16"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="h-4 w-4"
												aria-hidden="true"
											>
												<title>削除アイコン</title>
												<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
											</svg>
										</Button>
									</form>
								</div>
							</CardHeader>
							<CardContent className="pb-3">
								<Link href={`/stores/${store.id}`} className="block">
									<AspectRatio
										ratio={4 / 3}
										className="bg-muted overflow-hidden rounded-md mb-3"
									>
										{store.main_image_url ? (
											<img
												src={store.main_image_url}
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
									{store.rating && (
										<div className="flex items-center gap-1">
											<span>★ {store.rating.toFixed(1)}</span>
											<span>({store.review_count}件)</span>
										</div>
									)}
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
			)}

			{/* お気に入り店舗がない場合 */}
			{favoriteStores.length === 0 && (
				<div className="text-center py-16 border rounded-lg bg-muted/30">
					<BookmarkCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-xl font-semibold mb-2">お気に入りはありません</h2>
					<Link href="/stores">
						<Button>条件で探す</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
