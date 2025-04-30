import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	trustHost: true,
	debug: process.env.NODE_ENV === "development",
	providers: [Google],
	callbacks: {
		async jwt({ token, user, account }) {
			if (user && account?.id_token) {
				token.idToken = account?.id_token;
			}
			return token;
		},
		async session({ token, session }) {
			session.idToken = token.idToken;
			return session;
		},
	},
});
