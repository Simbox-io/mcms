// app/api/pages/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;

  try {
    const comments = await prisma.comment.findMany({
      where: { pageId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        reactions: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching page comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const pageId = params.id;
  const { content, parentId } = await request.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userObj.id } },
        page: { connect: { id: pageId } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        reactions: true,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating page comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}