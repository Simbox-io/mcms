// app/api/users/[id]/reactions/route.ts
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
    const commentReactions = await prisma.commentReaction.findMany({
      where: { userId },
      include: {
        comment: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            post: true,
            file: true,
            project: true,
            page: true,
          },
        },
      },
    });

    const fileReactions = await prisma.fileReaction.findMany({
      where: { userId },
      include: {
        file: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            project: true,
            tags: true,
          },
        },
      },
    });

    return NextResponse.json({ commentReactions, fileReactions });
  } catch (error) {
    console.error('Error fetching user reactions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}