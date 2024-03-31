// app/api/impersonate/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma, { User } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
  const userObj = session?.user as unknown as User;

  if (!session.sessionId || userObj.role !== 'ADMIN') {
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

  return NextResponse.json({ message: 'Impersonation successful' });
}

