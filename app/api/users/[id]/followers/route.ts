// app/api/users/[id]/followers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const followers = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        followedBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(followers);
  } catch (error) {
    console.error('Error fetching user followers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}