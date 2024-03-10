import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await request.json();

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: session.user.id,
          },
        },
        forum: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}