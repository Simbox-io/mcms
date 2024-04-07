import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { courseId: string; lessonId: string } }) {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        courseId: params.courseId,
      },
      include: {
        quizzes: true,
        assignments: true,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Failed to fetch lesson', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}