// app/api/users/[id]/comments/route.ts
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
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}