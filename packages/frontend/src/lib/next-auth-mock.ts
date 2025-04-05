// Mock for next-auth
export interface Session {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    id?: string;
  };
  expires: string;
}

export interface JWT {
  token?: string;
  name?: string;
  email?: string;
}

export interface NextAuthOptions {
  providers: any[];
  session?: {
    strategy?: 'jwt' | 'database';
    maxAge?: number;
  };
  callbacks?: {
    signIn?: (params: any) => Promise<boolean> | boolean;
    session?: (params: any) => Promise<any> | any;
    jwt?: (params: any) => Promise<any> | any;
  };
  pages?: {
    signIn?: string;
    signOut?: string;
    error?: string;
  };
}

const NextAuthMock = (options: NextAuthOptions) => {
  // This is just a mock implementation that doesn't do anything
  return {
    handlers: {
      GET: async () => ({}),
      POST: async () => ({})
    }
  };
};

export function getServerSession(): Promise<Session | null> {
  return Promise.resolve({
    user: {
      name: 'Mock User',
      email: 'mock@example.com',
      id: '123'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });
}

export default NextAuthMock; 