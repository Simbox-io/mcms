// app/api/tutorials/[id]/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tutorialId = params.id;

  try {
    const tags = await prisma.tag.findMany({
      where: {
        tutorials: {
          some: {
            id: tutorialId,
          },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tutorial tags:', error);
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
  const { tags } = await request.json();

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
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(updatedTutorial);
  } catch (error) {
    console.error('Error adding tutorial tags:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}