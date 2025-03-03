// app/api/forum/topics/[slug]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '20');
  const parentId = searchParams.get('parentId') || null;

  try {
    // First, check if the topic exists
    const topic = await cachedPrisma.forumTopic.findUnique({
      where: { slug },
    });

    if (!topic) {
      return NextResponse.json(
        { message: 'Forum topic not found' },
        { status: 404 }
      );
    }

    // Build the filter for posts
    const filter: any = {
      topicId: topic.id,
    };

    // If parentId is provided, get only replies to that post
    // If parentId is null, get only root posts
    if (parentId) {
      filter.parentId = parentId;
    } else {
      filter.parentId = null;
    }

    const [posts, count] = await Promise.all([
      cachedPrisma.forumPost.findMany({
        where: filter,
        orderBy: {
          createdAt: 'asc',
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      cachedPrisma.forumPost.count({
        where: filter,
      }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        perPage,
        total: count,
        totalPages: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { message: 'Error fetching forum posts' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { slug } = params;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, parentId } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: 400 }
      );
    }

    // Check if the topic exists and is not locked
    const topic = await cachedPrisma.forumTopic.findUnique({
      where: { slug },
    });

    if (!topic) {
      return NextResponse.json(
        { message: 'Forum topic not found' },
        { status: 404 }
      );
    }

    if (topic.isLocked && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'This topic is locked' },
        { status: 403 }
      );
    }

    // If parentId is provided, check if the parent post exists and belongs to this topic
    if (parentId) {
      const parentPost = await cachedPrisma.forumPost.findUnique({
        where: { id: parentId },
      });

      if (!parentPost) {
        return NextResponse.json(
          { message: 'Parent post not found' },
          { status: 404 }
        );
      }

      if (parentPost.topicId !== topic.id) {
        return NextResponse.json(
          { message: 'Parent post does not belong to this topic' },
          { status: 400 }
        );
      }
    }

    // Create the post
    const post = await cachedPrisma.forumPost.create({
      data: {
        content,
        authorId: userObj.id,
        topicId: topic.id,
        parentId: parentId || null,
      },
    });

    // Update the topic's last post information
    await cachedPrisma.forumTopic.update({
      where: { id: topic.id },
      data: {
        lastPostId: post.id,
        lastPostAt: post.createdAt,
        lastPostUser: userObj.username,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { message: 'Error creating forum post' },
      { status: 500 }
    );
  }
}
