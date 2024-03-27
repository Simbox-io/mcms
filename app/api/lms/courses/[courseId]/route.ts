import { NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { courseId: string } }) {
  try {
    const course = await cachedPrisma.course.findUnique({
      where: { id: params.courseId },
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
        lessons: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Failed to fetch course', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}