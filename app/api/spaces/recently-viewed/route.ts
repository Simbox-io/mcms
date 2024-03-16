// app/api/spaces/recently-viewed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const recentlyViewedSpaces = await prisma.spaceView.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        space: {
          include: {
            owner: true,
            project: true,
          },
        },
      },
    });

    const spaces = recentlyViewedSpaces.map((view) => view.space);

    return NextResponse.json(spaces);
  } catch (error) {
    console.error('Error fetching recently viewed spaces:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { spaceId } = await request.json();

  try {
    const existingView = await prisma.spaceView.findUnique({
      where: {
        spaceId_userId: {
          userId: user.id,
          spaceId,
        },
      },
    });

    if (existingView) {
      await prisma.spaceView.update({
        where: {
          id: existingView.id,
        },
        data: {
          createdAt: new Date(),
        },
      });
    } else {
      await prisma.spaceView.create({
        data: {
          user: { connect: { id: user.id } },
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