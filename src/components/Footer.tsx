import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-muted py-8 mt-12">
						<div className="container mx-auto px-4">
							<div className="flex flex-col md:flex-row justify-between items-center gap-6">
								<div className="text-center md:text-left">
									<h3 className="font-semibold text-lg mb-2">PokerPortal</h3>
									<p className="text-sm text-muted-foreground">
										日本全国のポーカー会場情報
									</p>
								</div>
								<nav className="flex flex-wrap justify-center gap-4 md:gap-6">
									<Link
										href="/"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										ホーム
									</Link>
									<Link
										href="/stores"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										条件で探す
									</Link>
									<Link
										href="/nearby"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										地図で探す
									</Link>
									<Link
										href="/favorites"
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										お気に入り
									</Link>
								</nav>
							</div>
							<div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center">
								<p className="text-xs md:text-sm text-muted-foreground">
									&copy; {new Date().getFullYear()} PokerPortal. All rights
									reserved.
								</p>
							</div>
						</div>
					</footer>
    )
}