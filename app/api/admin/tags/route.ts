// app/api/admin/tags/route.ts
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
    const tags = await cachedPrisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        post_tags: {
          select: {
            post_id: true,
          },
        },
      },
    });

    // Transform the data to include post count
    const transformedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      createdAt: tag.created_at,
      updatedAt: tag.updated_at,
      postCount: tag.post_tags.length,
    }));

    return NextResponse.json(transformedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, slug, description } = await request.json();

    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Check if slug already exists
    const existingTag = await cachedPrisma.tag.findFirst({
      where: { slug: finalSlug },
    });

    if (existingTag) {
      return NextResponse.json(
        { message: 'A tag with this slug already exists' },
        { status: 400 }
      );
    }

    // Create tag
    const newTag = await cachedPrisma.tag.create({
      data: {
        name,
        slug: finalSlug,
        description,
      },
    });

    return NextResponse.json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
