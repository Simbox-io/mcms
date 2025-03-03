// app/api/forum/categories/[slug]/route.ts
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

  try {
    const category = await cachedPrisma.forumCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            topics: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Forum category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching forum category:', error);
    return NextResponse.json(
      { message: 'Error fetching forum category' },
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

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, icon, order } = await request.json();

    // Check if the category exists
    const existingCategory = await cachedPrisma.forumCategory.findUnique({
      where: { slug },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Forum category not found' },
        { status: 404 }
      );
    }

    let newSlug = slug;
    if (name && name !== existingCategory.name) {
      newSlug = slugify(name, { lower: true });

      // Check if another category already has this slug
      const duplicateSlug = await cachedPrisma.forumCategory.findUnique({
        where: { slug: newSlug },
      });

      if (duplicateSlug && duplicateSlug.id !== existingCategory.id) {
        return NextResponse.json(
          { message: 'A category with this name already exists' },
          { status: 400 }
        );
      }
    }

    const category = await cachedPrisma.forumCategory.update({
      where: { id: existingCategory.id },
      data: {
        name: name || existingCategory.name,
        description: description !== undefined ? description : existingCategory.description,
        slug: newSlug,
        icon: icon !== undefined ? icon : existingCategory.icon,
        order: order !== undefined ? order : existingCategory.order,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating forum category:', error);
    return NextResponse.json(
      { message: 'Error updating forum category' },
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

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the category exists
    const existingCategory = await cachedPrisma.forumCategory.findUnique({
      where: { slug },
      include: {
        topics: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { message: 'Forum category not found' },
        { status: 404 }
      );
    }

    // Check if there are topics in this category
    if (existingCategory.topics.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete a category with topics. Move or delete the topics first.' },
        { status: 400 }
      );
    }

    await cachedPrisma.forumCategory.delete({
      where: { id: existingCategory.id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum category:', error);
    return NextResponse.json(
      { message: 'Error deleting forum category' },
      { status: 500 }
    );
  }
}
