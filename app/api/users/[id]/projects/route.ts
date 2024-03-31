// app/api/users/[id]/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { collaborators: { some: { id: userId } } },
        ],
      },
      include: {
        owner: {
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
        files: true,
        tags: true,
        comments: true,
        spaces: true,
        bookmarks: true,
        settings: {
          include: {
            visibilitySettings: true,
            collaborationSettings: true,
            notificationSettings: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}