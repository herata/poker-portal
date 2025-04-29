import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
				<Providers>
					{/* Header */}
					<Header />

					{/* Main Content */}
					<main className="flex-grow">{children}</main>

					{/* Footer */}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
