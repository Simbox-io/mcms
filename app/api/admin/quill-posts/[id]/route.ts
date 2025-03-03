// app/api/admin/quill-posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const quillPost = await cachedPrisma.quillPost.findUnique({
      where: { id },
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

    if (!quillPost) {
      return NextResponse.json({ message: 'Quill post not found' }, { status: 404 });
    }

    return NextResponse.json(quillPost);
  } catch (error) {
    console.error('Error fetching quill post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { title, content } = await request.json();

  try {
    const quillPost = await cachedPrisma.quillPost.findUnique({
      where: { id },
    });

    if (!quillPost) {
      return NextResponse.json({ message: 'Quill post not found' }, { status: 404 });
    }

    const updatedQuillPost = await cachedPrisma.quillPost.update({
      where: { id },
      data: {
        title: title !== undefined ? title : quillPost.title,
        content: content !== undefined ? content : quillPost.content,
      },
    });

    return NextResponse.json(updatedQuillPost);
  } catch (error) {
    console.error('Error updating quill post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const quillPost = await cachedPrisma.quillPost.findUnique({
      where: { id },
    });

    if (!quillPost) {
      return NextResponse.json({ message: 'Quill post not found' }, { status: 404 });
    }

    await cachedPrisma.quillPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Quill post deleted successfully' });
  } catch (error) {
    console.error('Error deleting quill post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
