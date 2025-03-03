// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';
import { activityListener } from '@/listeners/activityListener';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalPosts = await cachedPrisma.post.count();
    const totalPages = Math.ceil(totalPosts / perPage);

    const posts = await cachedPrisma.post.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        tags: true,
        comments: true,
        bookmarks: true,
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
  const session = await getSession(request);
  const user = session?.user as User;

  console.log(user)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!user || !user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const existingUser = await cachedPrisma.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const { title, content, tags, settings } = await request.json();

  try {
    const newPost = await cachedPrisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: user.id,
          },
        },
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

    console.log(newPost);
    await activityListener('POST_CREATED', newPost.id, 'POST', newPost.authorId);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}