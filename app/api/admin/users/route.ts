// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma, { User } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';


export async function GET(request: NextRequest) {
  const session = auth();
  const user = await currentUser();

  if(!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userObj = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  }) as unknown as User;

  if (!session.sessionId || userObj?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userObj.email },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}