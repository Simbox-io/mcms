// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs';
import { activityListener } from '@/listeners/activityListener';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / perPage);

    const posts = await prisma.post.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
        tags: true,
        comments: true,
        bookmarks: true,
        settings: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ posts, totalPages });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = auth();
  const user = await currentUser();

  if (!session.sessionId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!user || !user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const { title, content, tags, settings } = await request.json();

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: user.id,
          },
        },
        tags: tags
          ? {
            connectOrCreate: tags.map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          } : undefined,
        settings: settings
          ? {
            create: {
              defaultVisibility: settings.defaultVisibility,
              commentSettings: settings.commentSettings
                ? {
                  create: {
                    allowComments: settings.commentSettings.allowComments,
                    moderateComments: settings.commentSettings.moderateComments,
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

    await activityListener('POST_CREATED', newPost.id, 'POST', newPost.authorId);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}