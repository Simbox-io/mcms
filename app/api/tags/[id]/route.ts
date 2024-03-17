// app/api/tags/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tagId = params.id;

  try {
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        posts: true,
        files: true,
        projects: true,
        tutorials: true,
      },
    });

    if (!tag) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const tagId = params.id;
  const { name } = await request.json();

  try {
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const tagId = params.id;

  try {
    await prisma.tag.delete({
      where: { id: tagId },
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}