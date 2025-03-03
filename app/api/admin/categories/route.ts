// app/api/admin/categories/route.ts
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
    const categories = await cachedPrisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        post: {
          select: {
            id: true,
          },
        },
      },
    });

    // Transform the data to include post count
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parent_id,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
      postCount: category.post.length,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
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
    const { name, slug, description, parentId } = await request.json();

    // Generate slug if not provided
    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    // Check if slug already exists
    const existingCategory = await cachedPrisma.category.findFirst({
      where: { slug: finalSlug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Create category
    const newCategory = await cachedPrisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description,
        parent_id: parentId,
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
