// app/api/spaces/[id]/collaborators/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const spaceId = params.id;

  try {
    const collaborators = await prisma.user.findMany({
      where: {
        collaboratedSpaces: {
          some: {
            id: spaceId,
          },
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error('Error fetching space collaborators:', error);
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
  const { collaboratorId } = await request.json();

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { owner: true },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.ownerId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.space.update({
      where: { id: spaceId },
      data: {
        collaborators: {
          connect: { id: collaboratorId },
        },
      },
    });

    return NextResponse.json({ message: 'Collaborator added successfully' });
  } catch (error) {
    console.error('Error adding space collaborator:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;
  const { collaboratorId } = await request.json();

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { owner: true },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.ownerId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.space.update({
      where: { id: spaceId },
      data: {
        collaborators: {
          disconnect: { id: collaboratorId },
        },
      },
    });

    return NextResponse.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    console.error('Error removing space collaborator:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}