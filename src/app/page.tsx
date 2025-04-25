import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	ChevronRight,
	Clock,
	CreditCard,
	MapPin,
	Search,
	Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="container mx-auto px-4 py-6 md:py-8">
			{/* Hero Section */}
			<section className="py-8 md:py-16">
				<div className="text-center space-y-4 md:space-y-6 max-w-3xl mx-auto">
					<h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
						PokerPortal
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground px-2">
						アミューズメントポーカー情報ポータル
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 md:pt-4">
						<Link href="/stores" className="w-full sm:w-auto">
							<Button size="lg" className="w-full gap-2">
								<Search className="mr-2 h-4 w-4" />
								条件で探す
							</Button>
						</Link>
						<Link href="/nearby" className="w-full sm:w-auto">
							<Button variant="outline" size="lg" className="w-full">
								<MapPin className="mr-2 h-4 w-4" />
								近くの会場
							</Button>
						</Link>
					</div>
				</div>
			</section>

			{/* Popular Areas - Mobile Only */}
			<section className="md:hidden mb-8">
				<h2 className="text-xl font-semibold mb-4">人気エリア</h2>
				<div className="grid grid-cols-2 gap-3">
					<Link href="/stores?area=渋谷">
						<div className="bg-muted/50 hover:bg-muted transition-colors rounded-lg p-4 flex justify-between items-center">
							<span>渋谷</span>
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						</div>
					</Link>
					<Link href="/stores?area=新宿">
						<div className="bg-muted/50 hover:bg-muted transition-colors rounded-lg p-4 flex justify-between items-center">
							<span>新宿</span>
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						</div>
					</Link>
					<Link href="/stores?area=池袋">
						<div className="bg-muted/50 hover:bg-muted transition-colors rounded-lg p-4 flex justify-between items-center">
							<span>池袋</span>
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						</div>
					</Link>
					<Link href="/stores?area=六本木">
						<div className="bg-muted/50 hover:bg-muted transition-colors rounded-lg p-4 flex justify-between items-center">
							<span>六本木</span>
							<ChevronRight className="h-4 w-4 text-muted-foreground" />
						</div>
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-8 md:py-16">
				<h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
					特徴
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
					<Card>
						<CardContent className="pt-6 text-center">
							<div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
								<Search className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg md:text-xl font-semibold mb-2">
								かんたん検索
							</h3>
							<p className="text-sm text-muted-foreground">
								エリアや特徴から、あなたにぴったりの会場が見つかります
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6 text-center">
							<div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
								<Clock className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg md:text-xl font-semibold mb-2">
								営業時間
							</h3>
							<p className="text-sm text-muted-foreground">
								最新の営業時間情報をチェックして、プレイのスケジュールを立てましょう
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6 text-center">
							<div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
								<CreditCard className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg md:text-xl font-semibold mb-2">
								料金情報
							</h3>
							<p className="text-sm text-muted-foreground">
								各会場の料金体系を一目でわかりやすく表示しています
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6 text-center">
							<div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
								<Users className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg md:text-xl font-semibold mb-2">
								コミュニティ
							</h3>
							<p className="text-sm text-muted-foreground">
								初心者から上級者まで、様々なレベルのプレイヤーが集まる会場を探せます
							</p>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-8 md:py-16">
				<div className="bg-muted rounded-xl p-6 md:p-12 text-center">
					<h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
						今すぐ会場を探そう
					</h2>
					<p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
						全国のポーカー会場情報が一覧で確認できます。
					</p>
					<Link href="/stores">
						<Button size="lg" className="w-full sm:w-auto min-w-40">
							会場一覧を見る
						</Button>
					</Link>
				</div>
			</section>

			{/* Latest News - Mobile Only */}
			<section className="md:hidden py-8">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">最新情報</h2>
					<Button variant="ghost" size="sm" className="text-sm">
						すべて見る
						<ChevronRight className="ml-1 h-4 w-4" />
					</Button>
				</div>
				<div className="space-y-4">
					<div className="border-b pb-3">
						<p className="text-sm text-muted-foreground">2025年4月15日</p>
						<p className="font-medium">
							新店舗「ポーカーキングダム浅草」がオープンしました
						</p>
					</div>
					<div className="border-b pb-3">
						<p className="text-sm text-muted-foreground">2025年4月5日</p>
						<p className="font-medium">
							ゴールデンウィーク期間中の特別営業時間のお知らせ
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
