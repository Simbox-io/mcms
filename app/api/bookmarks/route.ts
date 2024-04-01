// app/api/bookmarks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = auth();
  const userObj = await currentUser();


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
  const session = auth();
  const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id, type } = await request.json();

  switch (type) {
    case 'post':
      const isPostBookmarked = await prisma.bookmark.findFirst({ where: { userId: userObj.id, postId: id } });
      if (isPostBookmarked) {
        await prisma.bookmark.delete({ where: { id: isPostBookmarked.id } });
        return NextResponse.json({ message: 'Bookmark deleted' }, { status: 200 });
      }
      break;
    case 'file':
      const isFileBookmarked = await prisma.bookmark.findFirst({ where: { userId: userObj.id, fileId: id } });
      if (isFileBookmarked) {
        await prisma.bookmark.delete({ where: { id: isFileBookmarked.id } });
        return NextResponse.json({ message: 'Bookmark deleted' }, { status: 200 });
      }
      break;
    case 'project':
      const isProjectBookmarked = await prisma.bookmark.findFirst({ where: { userId: userObj.id, projectId: id } });
      if (isProjectBookmarked) {
        await prisma.bookmark.delete({ where: { id: isProjectBookmarked.id } });
        return NextResponse.json({ message: 'Bookmark deleted' }, { status: 200 });
      }
      break;
    case 'space':
      const isSpaceBookmarked = await prisma.bookmark.findFirst({ where: { userId: userObj.id, spaceId: id } });
      if (isSpaceBookmarked) {
        await prisma.bookmark.delete({ where: { id: isSpaceBookmarked.id } });
        return NextResponse.json({ message: 'Bookmark deleted' }, { status: 200 });
      }
      break;
    case 'page':
      const isPageBookmarked = await prisma.bookmark.findFirst({ where: { userId: userObj.id, pageId: id } });
      if (isPageBookmarked) {
        await prisma.bookmark.delete({ where: { id: isPageBookmarked.id } });
        return NextResponse.json({ message: 'Bookmark deleted' }, { status: 200 });
      }
      break;
    case 'tutorial':
      const isTutorialBookmarked = await prisma.bookmark.findFirst({ where: { userId: userObj.id, tutorialId: id } });
    if (isTutorialBookmarked) {
      await prisma.bookmark.delete({ where: { id: isTutorialBookmarked.id } });
      return NextResponse.json({ message: 'Bookmark deleted' }, { status: 200 });
    }
      break;
  }

  try {
    
    const newBookmark = await prisma.bookmark.create({
      data: {
        user: { connect: { id: userObj.id } },
        post: type === 'post' ? { connect: { id } } : undefined,
        file: type === 'file' ? { connect: { id } } : undefined,
        project: type === 'project' ? { connect: { id } } : undefined,
        space: type === 'space' ? { connect: { id } } : undefined,
        page: type === 'page' ? { connect: { id } } : undefined,
        tutorial: type === 'tutorial' ? { connect: { id } } : undefined,
      },
    });

    return NextResponse.json(newBookmark, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}