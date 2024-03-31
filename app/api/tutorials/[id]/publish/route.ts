// app/api/tutorials/[id]/publish/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const tutorialId = params.id;

  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      include: {
        author: true,
      },
    });

    if (!tutorial) {
      return NextResponse.json({ message: 'Tutorial not found' }, { status: 404 });
    }

    if (tutorial.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const publishedTutorial = await prisma.tutorial.update({
      where: { id: tutorialId },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json(publishedTutorial);
  } catch (error) {
    console.error('Error publishing tutorial:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}