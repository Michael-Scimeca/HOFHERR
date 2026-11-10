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

        // Development God Mode instant session
        if (
          process.env.NODE_ENV !== 'production' &&
          enteredEmail === 'godmode@hofherrmeats.com' &&
          enteredPassword === 'hofherr-dev-god-mode'
        ) {
          return {
            id: 'master-admin',
            email: process.env.ADMIN_EMAIL?.toLowerCase().trim() || 'admin@hofherrmeats.com',
            name: 'Hofherr God Mode',
            phone: '847-441-6328',
            avatar: '/assets/avatars/avatar-angus-bull.jpg',
            isAdmin: true,
          };
        }

        // Shop-Specific Admin Logins (credentials from environment variables + explicit admin logins)
        const adminAccounts = [
          {
            email: process.env.BUTCHER_ADMIN_EMAIL?.toLowerCase().trim(),
            password: process.env.BUTCHER_ADMIN_PASSWORD?.trim(),
            id: 'admin-butcher',
            name: 'Butcher Shop Admin',
            phone: '847-441-6328',
            avatar: '/assets/avatars/avatar-angus-bull.jpg',
          },
          {
            email: process.env.DEPOT_ADMIN_EMAIL?.toLowerCase().trim(),
            password: process.env.DEPOT_ADMIN_PASSWORD?.trim(),
            id: 'admin-depot',
            name: 'The Depot Admin',
            phone: '847-441-5262',
            avatar: '/assets/avatars/avatar-berkshire-boar.jpg',
          },
          {
            email: process.env.ADMIN_EMAIL?.toLowerCase().trim(),
            password: process.env.ADMIN_PASSWORD?.trim(),
            id: 'master-admin',
            name: 'Hofherr Master Admin',
            phone: '847-441-6328',
            avatar: '/assets/avatars/avatar-angus-bull.jpg',
          },
          {
            email: 'admin@hofherrmeats.com',
            password: 'hofherr123',
            id: 'master-admin',
            name: 'Hofherr Master Admin',
            phone: '847-441-6328',
            avatar: '/assets/avatars/avatar-angus-bull.jpg',
          },
          {
            email: 'butcher@hofherrmeats.com',
            password: 'hofherr123',
            id: 'admin-butcher',
            name: 'Butcher Shop Admin',
            phone: '847-441-6328',
            avatar: '/assets/avatars/avatar-angus-bull.jpg',
          },
          {
            email: 'depot@hofherrmeats.com',
            password: 'hofherr123',
            id: 'admin-depot',
            name: 'The Depot Admin',
            phone: '847-441-5262',
            avatar: '/assets/avatars/avatar-berkshire-boar.jpg',
          },
        ];

        for (const admin of adminAccounts) {
          if (admin.email && admin.password && enteredEmail === admin.email && enteredPassword === admin.password) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              phone: admin.phone,
              avatar: admin.avatar,
              isAdmin: true,
            };
          }
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
          avatar: user.avatar || '/assets/avatars/avatar-angus-bull.jpg',
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

        if (account?.provider && account.provider !== 'credentials') {
          // OAuth provider handling
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
