// app/api/impersonate/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/options';
import { encode } from 'next-auth/jwt';
import prisma, { User } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userObj = session?.user as User;

  if (!session || userObj.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Create a new session for the impersonated user
  const impersonatedSession = {
    ...session,
    user: {
      ...session.user,
      ...user,
      isImpersonated: true,
    },
  };

  // Create a new JWT token with the impersonated session
  const token = await encode({
    secret: process.env.NEXTAUTH_SECRET || '',
    token: impersonatedSession,
  });


  // Set the JWT token as a cookie
  const response = NextResponse.json({ message: 'Impersonation successful' });
  response.cookies.set('next-auth.session-token', token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  });

  return response;
}