// app/api/spaces/[id]/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const spaceId = params.id;

  try {
    const pages = await prisma.page.findMany({
      where: { spaceId },
      include: {
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

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching space pages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;
  const { title, content, settings } = await request.json();

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { collaborators: true },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.ownerId !== userObj.id && !space.collaborators.some((collaborator) => collaborator.id === userObj.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        content,
        space: { connect: { id: spaceId } },
        settings: settings
          ? {
              create: {
                seoSettings: settings.seoSettings
                  ? {
                      create: {
                        metaTitle: settings.seoSettings.metaTitle,
                        metaDescription: settings.seoSettings.metaDescription,
                        openGraphTags: settings.seoSettings.openGraphTags,
                      },
                    }
                  : undefined,
                revisionHistorySettings: settings.revisionHistorySettings
                  ? {
                      create: {
                        revisionsToKeep: settings.revisionHistorySettings.revisionsToKeep,
                      },
                    }
                  : undefined,
                commentingSettings: settings.commentingSettings
                  ? {
                      create: {
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

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error('Error creating space page:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}