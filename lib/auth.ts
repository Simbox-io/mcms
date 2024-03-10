// lib/auth.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

export async function getSession(request: Request) {
  const session = await getServerSession(authOptions);
  return session;
}