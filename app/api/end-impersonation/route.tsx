// app/api/end-impersonation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
  const session = auth();

  if (!session.sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Clear the impersonation session and restore the original session
  const originalSession = {
    ...session,
    user: {
      ...session.user,
      isImpersonated: false,
    },
  };

  // Set the original session as a cookie
  const response = NextResponse.json({ message: 'Impersonation ended' });
  response.cookies.set('next-auth.session-token', JSON.stringify(originalSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return NextResponse.redirect(new URL('/login'))

  return response;
}