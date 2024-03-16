// app/api/pages/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;

  try {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        space: true,
        comments: true,
        bookmarks: true,
        settings: {
          include: {
            seoSettings: true,
            revisionHistorySettings: true,
            commentingSettings: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const pageId = params.id;
  const { title, content, settings } = await request.json();

  try {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { space: true },
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    if (page.space.ownerId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedPage = await prisma.page.update({
      where: { id: pageId },
      data: {
        title,
        content,
        version: { increment: 1 },
        settings: settings
          ? {
              update: {
                seoSettings: settings.seoSettings
                  ? {
                      update: {
                        metaTitle: settings.seoSettings.metaTitle,
                        metaDescription: settings.seoSettings.metaDescription,
                        openGraphTags: settings.seoSettings.openGraphTags,
                      },
                    }
                  : undefined,
                revisionHistorySettings: settings.revisionHistorySettings
                  ? {
                      update: {
                        revisionsToKeep: settings.revisionHistorySettings.revisionsToKeep,
                      },
                    }
                  : undefined,
                commentingSettings: settings.commentingSettings
                  ? {
                      update: {
                        allowComments: settings.commentingSettings.allowComments,
                        moderateComments: settings.commentingSettings.moderateComments,
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
      include: {
        space: true,
        comments: true,
        bookmarks: true,
        settings: {
          include: {
            seoSettings: true,
            revisionHistorySettings: true,
            commentingSettings: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const pageId = params.id;

  try {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { space: true },
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    if (page.space.ownerId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.page.delete({
      where: { id: pageId },
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}