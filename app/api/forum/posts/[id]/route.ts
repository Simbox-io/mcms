// app/api/forum/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const post = await cachedPrisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        replies: {
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
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: 'Forum post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching forum post:', error);
    return NextResponse.json(
      { message: 'Error fetching forum post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { id } = params;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { content, reactions } = await request.json();

    // Check if the post exists
    const existingPost = await cachedPrisma.forumPost.findUnique({
      where: { id },
      include: {
        topic: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Forum post not found' },
        { status: 404 }
      );
    }

    // Only author or admin can edit the post content
    if (content && existingPost.authorId !== userObj.id && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'You do not have permission to edit this post' },
        { status: 403 }
      );
    }

    // Check if the topic is locked
    if (existingPost.topic.isLocked && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'This topic is locked' },
        { status: 403 }
      );
    }

    const updateData: any = {};
    
    // Update content if provided
    if (content) {
      updateData.content = content;
      updateData.isEdited = true;
    }
    
    // Update reactions if provided
    if (reactions) {
      updateData.reactions = reactions;
    }

    const post = await cachedPrisma.forumPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating forum post:', error);
    return NextResponse.json(
      { message: 'Error updating forum post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { id } = params;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the post exists
    const existingPost = await cachedPrisma.forumPost.findUnique({
      where: { id },
      include: {
        topic: true,
        replies: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Forum post not found' },
        { status: 404 }
      );
    }

    // Only author or admin can delete the post
    if (existingPost.authorId !== userObj.id && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this post' },
        { status: 403 }
      );
    }

    // Check if the topic is locked
    if (existingPost.topic.isLocked && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'This topic is locked' },
        { status: 403 }
      );
    }

    // First delete any replies to this post
    if (existingPost.replies.length > 0) {
      await cachedPrisma.forumPost.deleteMany({
        where: {
          parentId: id,
        },
      });
    }

    // Then delete the post itself
    await cachedPrisma.forumPost.delete({
      where: { id },
    });

    // If this was the last post of the topic, update the last post information
    const topicLastPost = await cachedPrisma.forumPost.findFirst({
      where: {
        topicId: existingPost.topicId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    if (topicLastPost) {
      await cachedPrisma.forumTopic.update({
        where: { id: existingPost.topicId },
        data: {
          lastPostId: topicLastPost.id,
          lastPostAt: topicLastPost.createdAt,
          lastPostUser: topicLastPost.author.username,
        },
      });
    } else {
      await cachedPrisma.forumTopic.update({
        where: { id: existingPost.topicId },
        data: {
          lastPostId: null,
          lastPostAt: null,
          lastPostUser: null,
        },
      });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    return NextResponse.json(
      { message: 'Error deleting forum post' },
      { status: 500 }
    );
  }
}
