// app/api/bookmarks/[id]/route.ts
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

  const bookmarkId = params.id;

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
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

    if (!bookmark || bookmark.userId !== userObj.id) {
      return NextResponse.json({ message: 'Bookmark not found' }, { status: 404 });
    }

    return NextResponse.json(bookmark);
  } catch (error) {
    console.error('Error fetching bookmark:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const bookmarkId = params.id;

  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark || bookmark.userId !== userObj.id) {
      return NextResponse.json({ message: 'Bookmark not found' }, { status: 404 });
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return NextResponse.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}