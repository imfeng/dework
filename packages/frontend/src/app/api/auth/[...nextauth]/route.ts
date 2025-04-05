import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.message || !credentials?.signature || !req.headers?.host) {
            return null;
          }

          const siwe = new SiweMessage(JSON.parse(credentials.message));
          const result = await siwe.verify({
            signature: credentials.signature,
            domain: req.headers.host,
            nonce: await getCsrfToken({ req }),
          });

          if (!result.success) {
            return null;
          }

          return {
            id: siwe.address,
            address: siwe.address,
          };
        } catch (e) {
          console.error('授權錯誤:', e);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.address = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
