import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Filter, Heart, Map as MapIcon } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ポーカーポータル | 日本全国のポーカー会場情報",
	description:
		"日本全国のポーカー会場情報を一覧で探せるポータルサイトです。場所、料金、特徴で会場を探せます。",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				{/* Header */}
				<header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
					<div className="container mx-auto px-4 py-3 flex items-center justify-between">
						<Link href="/" className="font-bold text-xl flex items-center z-10">
							<span className="hidden sm:inline">PokerPortal</span>
							<span className="sm:hidden">PP</span>
						</Link>

						{/* Desktop Navigation */}
						<nav className="hidden md:flex items-center gap-6">
							<Link
								href="/stores"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
							>
								<Filter className="h-4 w-4" />
								条件で探す
							</Link>
							<Link
								href="/nearby"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
							>
								<MapIcon className="h-4 w-4" />
								地図で探す
							</Link>
							<Link
								href="/favorites"
								className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
							>
								<Heart className="h-4 w-4" />
								お気に入り
							</Link>
						</nav>

						{/* Mobile Navigation Icons */}
						<div className="flex md:hidden items-center gap-5">
							<Link
								href="/stores"
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label="条件で探す"
							>
								<Filter className="h-5 w-5" />
							</Link>
							<Link
								href="/nearby"
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label="地図で探す"
							>
								<MapIcon className="h-5 w-5" />
							</Link>
							<Link
								href="/favorites"
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label="お気に入り"
							>
								<Heart className="h-5 w-5" />
							</Link>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-grow">{children}</main>

				{/* Footer */}
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

				{/* JavaScript for Mobile Menu Toggle - Removed */}
			</body>
		</html>
	);
}
