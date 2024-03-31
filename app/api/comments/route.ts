// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';
import { getUser } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const user = await currentUser() as User | null;
  
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userAccount = await getUser(user.username);

  const { content, postId, fileId, projectId, pageId, parentId, tutorialId } = await request.json();

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userAccount?.id } },
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