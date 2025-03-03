// app/api/admin/tags/[id]/route.ts
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
    const tag = await cachedPrisma.tag.findUnique({
      where: { id: params.id },
      include: {
        post_tags: {
          select: {
            post_id: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
    }

    // Transform the data
    const transformedTag = {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      createdAt: tag.created_at,
      updatedAt: tag.updated_at,
      postCount: tag.post_tags.length,
    };

    return NextResponse.json(transformedTag);
  } catch (error) {
    console.error('Error fetching tag:', error);
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
    const { name, slug, description } = await request.json();

    // Check if slug already exists (excluding current tag)
    if (slug) {
      const existingTag = await cachedPrisma.tag.findFirst({
        where: {
          slug,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingTag) {
        return NextResponse.json(
          { message: 'A tag with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update tag
    const updatedTag = await cachedPrisma.tag.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
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
    // Check if tag exists
    const tag = await cachedPrisma.tag.findUnique({
      where: { id: params.id },
      include: {
        post_tags: true,
      },
    });

    if (!tag) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
    }

    // Delete associated post_tags first
    if (tag.post_tags.length > 0) {
      await cachedPrisma.postTags.deleteMany({
        where: { tag_id: params.id },
      });
    }

    // Delete tag
    await cachedPrisma.tag.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
