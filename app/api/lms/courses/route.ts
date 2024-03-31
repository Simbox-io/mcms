import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '9');
  const category = searchParams.get('category');
  const tags = searchParams.get('tags')?.split(',') || [];
  const search = searchParams.get('search');

  try {
    const totalCount = await prisma.course.count({
      where: {
        title: { contains: search || '' },
        categories: category ? { some: { id: category } } : undefined,
        tags: tags.length > 0 ? { some: { id: { in: tags.map((tag) => tag) } } } : undefined,
      },
    });

    const courses = await prisma.course.findMany({
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
        categories: true, // Include the entire CourseCategory object
        tags: true, // Include the entire Tag object
      },
    });

    return NextResponse.json({ courses, totalCount });
  } catch (error) {
    console.error('Failed to fetch courses', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
