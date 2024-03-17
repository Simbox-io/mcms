// app/api/tutorials/[id]/prerequisites/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tutorialId = params.id;

  try {
    const prerequisites = await prisma.prerequisite.findMany({
      where: {
        tutorialSettingsId: tutorialId,
      },
      include: {
        requiredTutorial: true,
      },
    });

    return NextResponse.json(prerequisites);
  } catch (error) {
    console.error('Error fetching tutorial prerequisites:', error);
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
  const { requiredKnowledge, requiredTutorialId } = await request.json();

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

    const newPrerequisite = await prisma.prerequisite.create({
      data: {
        requiredKnowledge,
        requiredTutorial: requiredTutorialId ? { connect: { id: requiredTutorialId } } : undefined,
        tutorialSettings: {
          connect: { tutorialId },
        },
      },
    });

    return NextResponse.json(newPrerequisite, { status: 201 });
  } catch (error) {
    console.error('Error adding tutorial prerequisite:', error);
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
  const { prerequisiteId } = await request.json();

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

    await prisma.prerequisite.delete({
      where: { id: prerequisiteId },
    });

    return NextResponse.json({ message: 'Prerequisite removed successfully' });
  } catch (error) {
    console.error('Error removing tutorial prerequisite:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}