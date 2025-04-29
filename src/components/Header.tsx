import { auth } from "@/lib/auth";
import { Filter, Heart, MapIcon } from "lucide-react";
import Link from "next/link";
import { LogInButton, LogOutButton } from "./AuthButton";

export async function Header() {
    const session = await auth();
	return (
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
                    {session ? <LogOutButton /> : <LogInButton />}
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
                    {session ? <LogOutButton /> : <LogInButton />}
				</div>
			</div>
		</header>
	);
}
