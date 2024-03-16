// app/api/users/[id]/tutorials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const tutorials = await prisma.tutorial.findMany({
        where: {
          OR: [
            { authorId: userId },
            { collaborators: { some: { id: userId } } },
          ],
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
            select: {
              difficultyLevel: true,
              prerequisites: true,
            },
          },
        },
    });

    return NextResponse.json(tutorials);
  } catch (error) {
    console.error('Error fetching user tutorials:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}