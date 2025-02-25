import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
 
// Notice this is only an object, not a full Auth.js instance
const authOptions: NextAuthConfig = {
  providers: [Google, Github],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      // Attach the user id from the token (typically token.sub) to the session object
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
}

export default authOptions