// app/middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { User } from './lib/prisma';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const user = token?.user as User;

  if (token) {
    // Clone the request headers and set the authorization header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${token}`);

    // Forward the request with the new headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Set a custom header to indicate if the user is impersonated
    if (user.isImpersonated) {
      response.headers.set('X-Impersonated-User', 'true');
    }

    return response;
  }

  return NextResponse.next();
}