"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

export const LogInButton = () => {
	return (
		<button
			type="button"
			className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
			aria-label="Login"
			onClick={() => signIn()}
		>
			<LogIn />
			<div className="hidden md:flex">ログイン</div>
		</button>
	);
};

export const LogOutButton = () => {
	return (
		<button
			type="button"
			className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
			aria-label="Logout"
			onClick={() => signOut()}
		>
			<LogOut />
			<div className="hidden md:flex">ログアウト</div>
		</button>
	);
};
