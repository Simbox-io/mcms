// app/api/admin/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const posts = await cachedPrisma.post.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        post_tags: {
          include: {
            tag: true,
          }
        },
        comment: true,
      },
    });

    // Transform the data to match the expected format in the frontend
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featured_image,
      authorId: post.author_id,
      categoryId: post.category_id,
      status: post.status,
      visibility: post.visibility,
      publishedAt: post.published_at,
      isFeatured: post.is_featured,
      allowComments: post.allow_comments,
      views: post.views,
      likes: post.likes,
      metaTitle: post.meta_title,
      metaDescription: post.meta_description,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      author: {
        name: post.user.name,
        email: post.user.email,
      },
      category: post.category ? {
        name: post.category.name,
        slug: post.category.slug,
      } : null,
      tags: post.post_tags.map(pt => ({
        tag: {
          name: pt.tag.name,
          slug: pt.tag.slug,
        }
      })),
      commentCount: post.comment.length,
    }));

    return NextResponse.json(transformedPosts);
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
    const newPost = await cachedPrisma.post.create({
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