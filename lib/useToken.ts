// lib/useToken.ts

import { useSession } from 'next-auth/react';

export function useToken() {
  const { data: session } = useSession();
  const token = session?.user?.token;
  return token;
}