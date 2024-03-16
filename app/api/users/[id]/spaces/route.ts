// app/api/users/[id]/spaces/route.ts
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
    const spaces = await prisma.space.findMany({
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
        pages: true,
        project: true,
        views: true,
        bookmarks: true,
        settings: {
          include: {
            accessControlSettings: true,
            collaborationSettings: true,
            versionControlSettings: true,
            exportSettings: true,
            backupSettings: true,
          },
        },
      },
    });

    return NextResponse.json(spaces);
  } catch (error) {
    console.error('Error fetching user spaces:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}