import NextAuth, { DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      department: string
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
    role: string
    department: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === "admin" && credentials?.password === "admin123") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@sturlite.com",
            role: "admin",
            department: "IT"
          }
        }

        if (credentials?.username === "manager" && credentials?.password === "manager123") {
          return {
            id: "2",
            name: "Manager User",
            email: "manager@sturlite.com",
            role: "manager",
            department: "Sales"
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.department = user.department
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.department = token.department as string
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  }
})