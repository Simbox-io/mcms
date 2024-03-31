import { ClerkOptions } from '@clerk/nextjs/server';
import { dark } from '@clerk/themes';

export const clerkConfig: ClerkOptions = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string,
  appearance: {
    baseTheme: dark,
  },
};
