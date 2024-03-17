// app/api/projects/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;

  try {
    const comments = await prisma.comment.findMany({
      where: { projectId },
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
    console.error('Error fetching project comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const projectId = params.id;
  const { content, parentId } = await request.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userObj.id } },
        project: { connect: { id: projectId } },
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
    console.error('Error creating project comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}