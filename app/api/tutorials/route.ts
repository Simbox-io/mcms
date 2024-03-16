// app/api/tutorials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalTutorials = await prisma.tutorial.count();
    const totalPages = Math.ceil(totalTutorials / perPage);

    const tutorials = await prisma.tutorial.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ tutorials, totalPages });
  } catch (error) {
    console.error('Error fetching tutorials:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, tags, collaborators, settings } = await request.json();

  try {
    const newTutorial = await prisma.tutorial.create({
      data: {
        title,
        content,
        author: { connect: { id: userObj.id } },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        collaborators: {
          connect: collaborators.map((collaboratorId: string) => ({ id: collaboratorId })),
        },
        settings: settings
          ? {
              create: {
                difficultyLevel: settings.difficultyLevel,
                prerequisites: {
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

    return NextResponse.json(newTutorial, { status: 201 });
  } catch (error) {
    console.error('Error creating tutorial:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}