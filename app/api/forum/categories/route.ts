// app/api/forum/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import slugify from 'slugify';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');

  try {
    const [categories, count] = await Promise.all([
      cachedPrisma.forumCategory.findMany({
        orderBy: {
          order: 'asc',
        },
        include: {
          _count: {
            select: {
              topics: true,
            },
          },
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      cachedPrisma.forumCategory.count(),
    ]);

    return NextResponse.json({
      categories,
      pagination: {
        page,
        perPage,
        total: count,
        totalPages: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    return NextResponse.json(
      { message: 'Error fetching forum categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, icon, order } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    const slug = slugify(name, { lower: true });

    // Check if a category with this slug already exists
    const existingCategory = await cachedPrisma.forumCategory.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    const category = await cachedPrisma.forumCategory.create({
      data: {
        name,
        description,
        slug,
        icon,
        order: order || 0,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating forum category:', error);
    return NextResponse.json(
      { message: 'Error creating forum category' },
      { status: 500 }
    );
  }
}
