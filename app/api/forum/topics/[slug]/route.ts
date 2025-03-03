// app/api/forum/topics/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import slugify from 'slugify';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const session = await getSession(request);
  const userObj = session?.user as User;

  try {
    const topic = await cachedPrisma.forumTopic.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json(
        { message: 'Forum topic not found' },
        { status: 404 }
      );
    }

    // Increment view count only if the viewer is not the author
    if (userObj && userObj.id !== topic.authorId) {
      await cachedPrisma.forumTopic.update({
        where: { id: topic.id },
        data: {
          viewCount: topic.viewCount + 1,
        },
      });
      topic.viewCount += 1;
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error fetching forum topic:', error);
    return NextResponse.json(
      { message: 'Error fetching forum topic' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { title, content, categoryId, tags, isPinned, isLocked } = await request.json();

    // Check if the topic exists
    const existingTopic = await cachedPrisma.forumTopic.findUnique({
      where: { slug },
    });

    if (!existingTopic) {
      return NextResponse.json(
        { message: 'Forum topic not found' },
        { status: 404 }
      );
    }

    // Only author or admin can edit the topic
    if (existingTopic.authorId !== userObj.id && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'You do not have permission to edit this topic' },
        { status: 403 }
      );
    }

    // Only admin can pin or lock topics
    if ((isPinned !== undefined || isLocked !== undefined) && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'Only administrators can pin or lock topics' },
        { status: 403 }
      );
    }

    // Verify category if changing
    if (categoryId && categoryId !== existingTopic.categoryId) {
      const category = await cachedPrisma.forumCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { message: 'Category not found' },
          { status: 404 }
        );
      }
    }

    let newSlug = slug;
    if (title && title !== existingTopic.title) {
      const baseSlug = slugify(title, { lower: true });
      
      // Check if another topic already has this slug
      let tempSlug = baseSlug;
      let counter = 1;
      let duplicateSlug = await cachedPrisma.forumTopic.findUnique({
        where: { slug: tempSlug },
      });

      // If a topic with this slug exists and it's not the current one, append an incrementing number
      while (duplicateSlug && duplicateSlug.id !== existingTopic.id) {
        tempSlug = `${baseSlug}-${counter}`;
        counter++;
        duplicateSlug = await cachedPrisma.forumTopic.findUnique({
          where: { slug: tempSlug },
        });
      }
      
      newSlug = tempSlug;
    }

    const updateData: any = {};
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (categoryId) updateData.categoryId = categoryId;
    if (tags) updateData.tags = tags;
    if (newSlug !== slug) updateData.slug = newSlug;
    
    // Only admins can modify these
    if (userObj.isAdmin) {
      if (isPinned !== undefined) updateData.isPinned = isPinned;
      if (isLocked !== undefined) updateData.isLocked = isLocked;
    }

    const topic = await cachedPrisma.forumTopic.update({
      where: { id: existingTopic.id },
      data: updateData,
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error updating forum topic:', error);
    return NextResponse.json(
      { message: 'Error updating forum topic' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    // Check if the topic exists
    const existingTopic = await cachedPrisma.forumTopic.findUnique({
      where: { slug },
      include: {
        posts: true,
      },
    });

    if (!existingTopic) {
      return NextResponse.json(
        { message: 'Forum topic not found' },
        { status: 404 }
      );
    }

    // Only author or admin can delete the topic
    if (existingTopic.authorId !== userObj.id && !userObj.isAdmin) {
      return NextResponse.json(
        { message: 'You do not have permission to delete this topic' },
        { status: 403 }
      );
    }

    // Delete all posts related to the topic first
    if (existingTopic.posts.length > 0) {
      // First, handle hierarchical posts to avoid foreign key constraints
      // Find all root posts (posts without a parent)
      const rootPosts = existingTopic.posts.filter(post => !post.parentId);
      
      // For each root post, delete its replies first
      for (const rootPost of rootPosts) {
        const replies = existingTopic.posts.filter(post => post.parentId === rootPost.id);
        
        if (replies.length > 0) {
          await cachedPrisma.forumPost.deleteMany({
            where: {
              id: {
                in: replies.map(reply => reply.id),
              },
            },
          });
        }
      }
      
      // Then delete the root posts
      await cachedPrisma.forumPost.deleteMany({
        where: {
          id: {
            in: rootPosts.map(post => post.id),
          },
        },
      });
    }

    // Finally, delete the topic
    await cachedPrisma.forumTopic.delete({
      where: { id: existingTopic.id },
    });

    return NextResponse.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum topic:', error);
    return NextResponse.json(
      { message: 'Error deleting forum topic' },
      { status: 500 }
    );
  }
}
