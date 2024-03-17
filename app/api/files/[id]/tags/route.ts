// app/api/files/[id]/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id;

  try {
    const tags = await prisma.tag.findMany({
      where: {
        files: {
          some: {
            id: fileId,
          },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching file tags:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const fileId = params.id;
  const { tags } = await request.json();

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { uploadedBy: true },
    });

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    if (file.uploadedBy.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    console.error('Error adding file tags:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}