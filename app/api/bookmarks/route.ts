// app/api/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalBookmarks = await prisma.bookmark.count({
      where: { userId: userObj.id },
    });
    const totalPages = Math.ceil(totalBookmarks / perPage);

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: userObj.id },
      skip: (page - 1) * perPage,
      take: perPage,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bookmarks, totalPages });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { postId, fileId, projectId, spaceId, pageId, tutorialId } = await request.json();

  try {
    const newBookmark = await prisma.bookmark.create({
      data: {
        user: { connect: { id: userObj.id } },
        post: postId ? { connect: { id: postId } } : undefined,
        file: fileId ? { connect: { id: fileId } } : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
        space: spaceId ? { connect: { id: spaceId } } : undefined,
        page: pageId ? { connect: { id: pageId } } : undefined,
        tutorial: tutorialId ? { connect: { id: tutorialId } } : undefined,
      },
    });

    return NextResponse.json(newBookmark, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}