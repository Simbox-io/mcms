import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const commentId = params.id;
  const { content, settings } = await request.json();

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
      },
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
        parent: true,
        children: true,
        reactions: true,
        tutorial: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const commentId = params.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
