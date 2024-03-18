// app/api/users/[id]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.id === userObj.id) {
      return NextResponse.json({ message: 'Cannot follow yourself' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userObj.id },
      data: {
        following: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}