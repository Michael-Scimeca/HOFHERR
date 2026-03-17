import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Apple from "next-auth/providers/apple"
import Facebook from "next-auth/providers/facebook"
import { adminClient } from '@/sanity/adminClient'
import bcrypt from 'bcryptjs'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isAdmin: boolean
      phone?: string
      avatar?: string
    } & DefaultSession["user"]
  }

  interface User {
    isAdmin?: boolean
    phone?: string
    avatar?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Apple,
    Facebook,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const enteredEmail = (credentials.email as string).toLowerCase().trim();
        const enteredPassword = (credentials.password as string);
        
        // Shop-Specific Admin Logins
        if (enteredEmail === 'butcher@hofherrmeats.com' && enteredPassword === 'PremiumCuts2026!') {
          return {
            id: 'admin-butcher',
            email: 'butcher@hofherrmeats.com',
            name: 'Butcher Shop Admin',
            isAdmin: true,
          };
        }
        if (enteredEmail === 'depot@hofherrmeats.com' && enteredPassword === 'PremiumCuts2026!') {
          return {
            id: 'admin-depot',
            email: 'depot@hofherrmeats.com',
            name: 'The Depot Admin',
            isAdmin: true,
          };
        }

        // Master Admin Login
        if (enteredEmail === 'admin@hofherrmeats.com' && enteredPassword === 'PremiumCuts2026!') {
          return {
            id: 'master-admin',
            email: 'admin@hofherrmeats.com',
            name: 'Hofherr Master Admin',
            isAdmin: true,
          };
        }

        const user = await adminClient.fetch(
          `*[_type == "customer" && email == $email][0]`,
          { email: enteredEmail }
        );

        if (!user || !user.password) return null;

        const isMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!isMatch) return null;

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          isAdmin: user.isAdmin,
          avatar: user.avatar || '',
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name || token.name;
        token.email = session.user.email || token.email;
        if (session.user.phone !== undefined) token.phone = session.user.phone;
        if (session.user.avatar !== undefined) token.avatar = session.user.avatar;
      }
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
        token.phone = user.phone;
        token.avatar = user.avatar;

        // If this is an OAuth sign in, we might need to create the user in Sanity if they don't exist
        if (account?.provider && account.provider !== 'credentials') {
          // NextAuth handles this via the adapter usually, but if custom, we shouldn't fetch Sanity here.
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore - appending custom properties to session user
        session.user.id = token.id as string;
        // @ts-ignore
        session.user.isAdmin = token.isAdmin as boolean;
        // @ts-ignore
        session.user.phone = token.phone as string;
        // @ts-ignore
        session.user.avatar = token.avatar as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  pages: {
    signIn: '/online-orders', // Redirect here if auth is required
  }
})
