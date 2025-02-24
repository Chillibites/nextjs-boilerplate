import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google, Github],
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig