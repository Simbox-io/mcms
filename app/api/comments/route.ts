// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { content, postId, fileId, projectId, pageId, parentId, tutorialId } = await request.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userObj.id } },
        post: postId ? { connect: { id: postId } } : undefined,
        file: fileId ? { connect: { id: fileId } } : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
        page: pageId ? { connect: { id: pageId } } : undefined,
        parent: parentId ? { connect: { id: parentId } } : undefined,
        tutorial: tutorialId ? { connect: { id: tutorialId } } : undefined,
      },
    });
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}