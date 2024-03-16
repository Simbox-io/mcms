// app/api/users/[id]/bookmarks/route.ts
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
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            tags: true,
          },
        },
        file: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            tags: true,
          },
        },
        project: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            tags: true,
          },
        },
        space: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        page: {
          include: {
            space: {
              include: {
                owner: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
        tutorial: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            tags: true,
          },
        },
      },
    });

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}