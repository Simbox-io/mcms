// app/api/forum/topics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import slugify from 'slugify';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '10');
  const categorySlug = searchParams.get('category');
  const tag = searchParams.get('tag');
  const sort = searchParams.get('sort') || 'updatedAt';
  const order = searchParams.get('order') || 'desc';

  try {
    // Build the filters
    const filters: any = {};
    if (categorySlug) {
      filters.category = {
        slug: categorySlug,
      };
    }
    if (tag) {
      filters.tags = {
        has: tag,
      };
    }

    // Build the sorting
    const orderBy: any = {};
    if (sort === 'createdAt' || sort === 'updatedAt' || sort === 'viewCount') {
      orderBy[sort] = order;
    } else {
      orderBy.updatedAt = 'desc';
    }

    // Add pinned topics at the top when sorting by most recent
    const pinnedSort = sort === 'updatedAt' && order === 'desc' 
      ? [{ isPinned: 'desc' }, { updatedAt: 'desc' }] 
      : [orderBy];

    const [topics, count] = await Promise.all([
      cachedPrisma.forumTopic.findMany({
        where: filters,
        orderBy: pinnedSort,
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
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      cachedPrisma.forumTopic.count({
        where: filters,
      }),
    ]);

    return NextResponse.json({
      topics,
      pagination: {
        page,
        perPage,
        total: count,
        totalPages: Math.ceil(count / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching forum topics:', error);
    return NextResponse.json(
      { message: 'Error fetching forum topics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, categoryId, tags } = await request.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json(
        { message: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Check if the category exists
    const category = await cachedPrisma.forumCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    const baseSlug = slugify(title, { lower: true });
    
    // Check if a topic with this slug already exists
    let slug = baseSlug;
    let counter = 1;
    let existingTopic = await cachedPrisma.forumTopic.findUnique({
      where: { slug },
    });

    // If a topic with this slug exists, append an incrementing number
    while (existingTopic) {
      slug = `${baseSlug}-${counter}`;
      counter++;
      existingTopic = await cachedPrisma.forumTopic.findUnique({
        where: { slug },
      });
    }

    const topic = await cachedPrisma.forumTopic.create({
      data: {
        title,
        content,
        slug,
        authorId: userObj.id,
        categoryId,
        tags: tags || [],
        lastPostAt: new Date(),
        lastPostUser: userObj.username,
      },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error('Error creating forum topic:', error);
    return NextResponse.json(
      { message: 'Error creating forum topic' },
      { status: 500 }
    );
  }
}
