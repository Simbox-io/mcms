import { NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { Course } from '@/lib/prisma';

type CourseData = Course & {
  instructor: {
    firstName: string;
    lastName: string;
    username: string;
  };
  categories: {
    name: string;
  }[];
  tags: {
    name: string;
  }[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page: number = parseInt(searchParams.get('page') || '1');
  const perPage: number = parseInt(searchParams.get('perPage') || '9');
  const category: string | null = searchParams.get('category');
  const tags: string[] = searchParams.get('tags')?.split(',') || [];
  const search: string | null = searchParams.get('search');

  try {
    const totalCount = await cachedPrisma.course.count({
      where: {
        title: { contains: search || '' },
        categories: category ? { some: { id: category } } : undefined,
        tags: tags.length > 0 ? { some: { id: { in: tags.map((tag) => tag) } } } : undefined,
      },
    });

    const courses: CourseData[] = await cachedPrisma.course.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        title: { contains: search || '' },
        categories: category ? { some: { id: category } } : undefined,
        tags: tags.length > 0 ? { some: { id: { in: tags.map((tag) => tag) } } } : undefined,
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        categories: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ courses, totalCount });
  } catch (error) {
    console.error('Failed to fetch courses', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
