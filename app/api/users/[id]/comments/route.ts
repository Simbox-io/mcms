// app/api/users/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const comments = await prisma.comment.findMany({
      where: { authorId: userId },
      include: {
        post: true,
        file: true,
        project: true,
        page: true,
        parent: true,
        children: true,
        reactions: true,
        settings: {
          include: {
            moderationSettings: true,
            threadingSettings: true,
            votingSettings: true,
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}