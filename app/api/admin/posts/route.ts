// app/api/admin/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        tags: true,
        comments: true,
        bookmarks: true,
        settings: {
          include: {
            commentSettings: true,
            sharingSettings: true,
            revisionHistorySettings: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, authorId, tags, settings } = await request.json();

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        settings: settings
          ? {
              create: {
                defaultVisibility: settings.defaultVisibility,
                commentSettings: settings.commentSettings
                  ? {
                      create: {
                        allowComments: settings.commentSettings.allowComments,
                        moderateComments: settings.commentSettings.moderateComments,
                        comment: settings.commentSettings.comment,
                      },
                    }
                  : undefined,
                sharingSettings: settings.sharingSettings
                  ? {
                      create: {
                        allowSharing: settings.sharingSettings.allowSharing,
                        sharePlatforms: settings.sharingSettings.sharePlatforms,
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
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}