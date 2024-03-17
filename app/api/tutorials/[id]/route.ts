// app/api/tutorials/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tutorialId = params.id;

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        tags: true,
        comments: true,
        bookmarks: true,
        settings: {
          include: {
            prerequisites: true,
          },
        },
      },
    });

    if (!tutorial) {
      return NextResponse.json({ message: 'Tutorial not found' }, { status: 404 });
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error('Error fetching tutorial:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const tutorialId = params.id;
  const { title, content, tags, collaborators, settings } = await request.json();

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      include: { author: true },
    });

    if (!tutorial) {
      return NextResponse.json({ message: 'Tutorial not found' }, { status: 404 });
    }

    if (tutorial.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedTutorial = await prisma.tutorial.update({
      where: { id: tutorialId },
      data: {
        title,
        content,
        tags: {
          set: tags.map((tag: string) => ({ name: tag })),
        },
        collaborators: {
          set: collaborators.map((collaboratorId: string) => ({ id: collaboratorId })),
        },
        settings: settings
          ? {
              update: {
                difficultyLevel: settings.difficultyLevel,
                prerequisites: {
                  deleteMany: {},
                  create: settings.prerequisites.map((prerequisite: any) => ({
                    requiredKnowledge: prerequisite.requiredKnowledge,
                    requiredTutorial: prerequisite.requiredTutorialId
                      ? { connect: { id: prerequisite.requiredTutorialId } }
                      : undefined,
                  })),
                },
              },
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        tags: true,
        comments: true,
        bookmarks: true,
        settings: {
          include: {
            prerequisites: true,
          },
        },
      },
    });

    return NextResponse.json(updatedTutorial);
  } catch (error) {
    console.error('Error updating tutorial:', error);
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

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      include: { author: true },
    });

    if (!tutorial) {
      return NextResponse.json({ message: 'Tutorial not found' }, { status: 404 });
    }

    if (tutorial.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.tutorial.delete({
      where: { id: tutorialId },
    });

    return NextResponse.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    console.error('Error deleting tutorial:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}