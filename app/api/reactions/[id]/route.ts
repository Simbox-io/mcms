// app/api/reactions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const reactionId = params.id;

  try {
    const reaction = await prisma.commentReaction.findUnique({
      where: { id: reactionId },
    });

    if (!reaction) {
      const fileReaction = await prisma.fileReaction.findUnique({
        where: { id: reactionId },
      });

      if (!fileReaction) {
        return NextResponse.json({ message: 'Reaction not found' }, { status: 404 });
      }

      if (fileReaction.userId !== userObj.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }

      await prisma.fileReaction.delete({
        where: { id: reactionId },
      });
    } else {
      if (reaction.userId !== userObj.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }

      await prisma.commentReaction.delete({
        where: { id: reactionId },
      });
    }

    return NextResponse.json({ message: 'Reaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}