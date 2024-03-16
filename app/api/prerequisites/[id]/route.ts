// app/api/prerequisites/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const prerequisiteId = params.id;

  try {
    const prerequisite = await prisma.prerequisite.findUnique({
      where: { id: prerequisiteId },
      include: {
        requiredTutorial: true,
      },
    });

    if (!prerequisite) {
      return NextResponse.json({ message: 'Prerequisite not found' }, { status: 404 });
    }

    return NextResponse.json(prerequisite);
  } catch (error) {
    console.error('Error fetching prerequisite:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const prerequisiteId = params.id;
  const { requiredKnowledge, requiredTutorialId } = await request.json();

  try {
    const prerequisite = await prisma.prerequisite.findUnique({
      where: { id: prerequisiteId },
      include: {
        tutorialSettings: {
          include: {
            tutorial: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });

    if (!prerequisite) {
      return NextResponse.json({ message: 'Prerequisite not found' }, { status: 404 });
    }

    if (prerequisite.tutorialSettings.tutorial.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedPrerequisite = await prisma.prerequisite.update({
      where: { id: prerequisiteId },
      data: {
        requiredKnowledge,
        requiredTutorial: requiredTutorialId
          ? { connect: { id: requiredTutorialId } }
          : undefined,
      },
      include: {
        requiredTutorial: true,
      },
    });

    return NextResponse.json(updatedPrerequisite);
  } catch (error) {
    console.error('Error updating prerequisite:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const prerequisiteId = params.id;

  try {
    const prerequisite = await prisma.prerequisite.findUnique({
      where: { id: prerequisiteId },
      include: {
        tutorialSettings: {
          include: {
            tutorial: {
              include: {
                author: true,
              },
            },
          },
        },
      },
    });

    if (!prerequisite) {
      return NextResponse.json({ message: 'Prerequisite not found' }, { status: 404 });
    }

    if (prerequisite.tutorialSettings.tutorial.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.prerequisite.delete({
      where: { id: prerequisiteId },
    });

    return NextResponse.json({ message: 'Prerequisite deleted successfully' });
  } catch (error) {
    console.error('Error deleting prerequisite:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}