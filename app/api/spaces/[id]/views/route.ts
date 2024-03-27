// app/api/spaces/[id]/views/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const spaceId = params.id;

  try {
    const views = await cachedPrisma.spaceView.findMany({
      where: { spaceId },
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

    return NextResponse.json(views);
  } catch (error) {
    console.error('Error fetching space views:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;

  try {
    const space = await cachedPrisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    const existingView = await cachedPrisma.spaceView.findUnique({
      where: {
        spaceId_userId: {
          userId: userObj.id,
          spaceId,
        },
      },
    });

    if (existingView) {
      await cachedPrisma.spaceView.update({
        where: {
          id: existingView.id,
        },
        data: {
          createdAt: new Date(),
        },
      });
    } else {
      await cachedPrisma.spaceView.create({
        data: {
          user: { connect: { id: userObj.id } },
          space: { connect: { id: spaceId } },
        },
      });
    }

    return NextResponse.json({ message: 'Space view recorded successfully' });
  } catch (error) {
    console.error('Error recording space view:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}