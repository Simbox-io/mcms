import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await request.json();

  try {
    const newQuillPost = await prisma.quillPost.create({
      data: {
        title,
        content,
        author: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(newQuillPost, { status: 201 });
  } catch (error) {
    console.error('Error creating Quill post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
