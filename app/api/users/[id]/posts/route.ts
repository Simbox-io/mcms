// app/api/users/[id]/posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}