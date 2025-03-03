// app/api/admin/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const post = await cachedPrisma.post.findUnique({
      where: { id: params.id },
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
          },
        },
        comment: true,
      },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Transform the data to match the expected format in the frontend
    const transformedPost = {
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
      category: post.category
        ? {
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
      tags: post.post_tags.map((pt) => ({
        tag: {
          name: pt.tag.name,
          slug: pt.tag.slug,
        },
      })),
      commentCount: post.comment.length,
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { 
      title, 
      content, 
      slug, 
      excerpt,
      featuredImage,
      categoryId,
      status,
      isFeatured,
      allowComments,
      metaTitle,
      metaDescription
    } = await request.json();

    // Check if post exists
    const post = await cachedPrisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Update post
    const updatedPost = await cachedPrisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featured_image: featuredImage,
        category_id: categoryId,
        status,
        is_featured: isFeatured,
        allow_comments: allowComments,
        meta_title: metaTitle,
        meta_description: metaDescription,
        published_at: status === 'published' && !post.published_at 
          ? new Date() 
          : post.published_at,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if post exists
    const post = await cachedPrisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Delete post
    await cachedPrisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
