// app/api/comments/[id]/reactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const commentId = params.id;

  try {
    const reactions = await cachedPrisma.commentReaction.findMany({
      where: { commentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(reactions);
  } catch (error) {
    console.error('Error fetching comment reactions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const commentId = params.id;
  const { type } = await request.json();

  try {
    const existingReaction = await cachedPrisma.commentReaction.findUnique({
      where: {
        userId_commentId: {
          commentId,
          userId: userObj.id,
        },
      },
    });

    if (existingReaction) {
      await cachedPrisma.commentReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });
      return NextResponse.json({ message: 'Reaction removed successfully' });
    } else {
      const newReaction = await cachedPrisma.commentReaction.create({
        data: {
          type,
          comment: { connect: { id: commentId } },
          user: { connect: { id: userObj.id } },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      return NextResponse.json(newReaction, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating comment reaction:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}