// app/api/files/[id]/reactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id;

  try {
    const reactions = await cachedPrisma.fileReaction.findMany({
      where: { fileId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(reactions);
  } catch (error) {
    console.error('Error fetching file reactions:', error);
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
  const { type } = await request.json();

  try {
    const existingReaction = await cachedPrisma.fileReaction.findUnique({
      where: {
        userId_fileId: {
          fileId,
          userId: userObj.id,
        },
      },
    });

    if (existingReaction) {
      await cachedPrisma.fileReaction.delete({
        where: {
          id: existingReaction.id,
        },
      });
      return NextResponse.json({ message: 'Reaction removed successfully' });
    } else {
      const newReaction = await cachedPrisma.fileReaction.create({
        data: {
          type,
          file: { connect: { id: fileId } },
          user: { connect: { id: userObj.id } },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      return NextResponse.json(newReaction, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating file reaction:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}