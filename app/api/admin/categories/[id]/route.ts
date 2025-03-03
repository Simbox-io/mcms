// app/api/admin/categories/[id]/route.ts
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
    const category = await cachedPrisma.category.findUnique({
      where: { id: params.id },
      include: {
        post: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Transform the data
    const transformedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parent_id,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
      postCount: category.post.length,
    };

    return NextResponse.json(transformedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
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
    const { name, slug, description, parentId } = await request.json();

    // Check if slug already exists (excluding current category)
    if (slug) {
      const existingCategory = await cachedPrisma.category.findFirst({
        where: {
          slug,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { message: 'A category with this slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update category
    const updatedCategory = await cachedPrisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        parent_id: parentId,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
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
    // Check if category exists
    const category = await cachedPrisma.category.findUnique({
      where: { id: params.id },
      include: {
        post: true,
      },
    });

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 });
    }

    // Check if category has posts
    if (category.post.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete category with associated posts' },
        { status: 400 }
      );
    }

    // Delete category
    await cachedPrisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
