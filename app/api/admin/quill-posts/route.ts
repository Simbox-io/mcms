// app/api/admin/quill-posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const quillPosts = await cachedPrisma.quillPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(quillPosts);
  } catch (error) {
    console.error('Error fetching quill posts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
  }

  try {
    const newQuillPost = await cachedPrisma.quillPost.create({
      data: {
        title,
        content,
        author: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(newQuillPost, { status: 201 });
  } catch (error) {
    console.error('Error creating quill post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
