// app/api/spaces/[id]/views/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const spaceId = params.id;

  try {
    const views = await prisma.spaceView.findMany({
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
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    const existingView = await prisma.spaceView.findUnique({
      where: {
        spaceId_userId: {
          userId: userObj.id,
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