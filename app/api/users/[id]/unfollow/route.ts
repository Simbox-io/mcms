// app/api/users/[id]/unfollow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


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

    await prisma.user.update({
      where: { id: userObj.id },
      data: {
        following: {
          disconnect: { id: userId },
        },
      },
    });

    return NextResponse.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}