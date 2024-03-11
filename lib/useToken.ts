// lib/useToken.ts

import { useSession } from 'next-auth/react';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function useGetTokenFromRequest(request: NextRequest) {
  const { data: session } = useSession();
  const token = session?.user?.token;
  return token;

}

export function decodeToken(token: string) {
  try {
    const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET as string);
    return decodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function useToken() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  return token;
}