// app/api/tutorials/[id]/collaborators/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tutorialId = params.id;

  try {
    const collaborators = await prisma.user.findMany({
      where: {
        collaboratedTutorials: {
          some: {
            id: tutorialId,
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
    console.error('Error fetching tutorial collaborators:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const tutorialId = params.id;
  const { collaboratorId } = await request.json();

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      include: { author: true },
    });

    if (!tutorial) {
      return NextResponse.json({ message: 'Tutorial not found' }, { status: 404 });
    }

    if (tutorial.authorId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.tutorial.update({
      where: { id: tutorialId },
      data: {
        collaborators: {
          connect: { id: collaboratorId },
        },
      },
    });

    return NextResponse.json({ message: 'Collaborator added successfully' });
  } catch (error) {
    console.error('Error adding tutorial collaborator:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const tutorialId = params.id;
  const { collaboratorId } = await request.json();

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      include: { author: true },
    });

    if (!tutorial) {
      return NextResponse.json({ message: 'Tutorial not found' }, { status: 404 });
    }

    if (tutorial.authorId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.tutorial.update({
      where: { id: tutorialId },
      data: {
        collaborators: {
          disconnect: { id: collaboratorId },
        },
      },
    });

    return NextResponse.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    console.error('Error removing tutorial collaborator:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}