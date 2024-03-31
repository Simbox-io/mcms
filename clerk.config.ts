import { ClerkOptions } from '@clerk/nextjs/server';

export const clerkConfig: ClerkOptions = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
};
