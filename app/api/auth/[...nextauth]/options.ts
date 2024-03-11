import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../lib/prisma';
import { compare } from 'bcrypt';
import { User } from '@prisma/client';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        
        if (!user || !(await compare(credentials.password, user.passwordHash))) {
          throw new Error('Invalid credentials');
        }

        user.id = user.id.toString();

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      session.user.token = token.jwt as string | undefined;
      return session;
    },
  },
  events: {
    async signOut() {
      // Perform any necessary cleanup or additional actions on sign out
    },
  },
  pages: {
    signIn: '/login',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default authOptions;