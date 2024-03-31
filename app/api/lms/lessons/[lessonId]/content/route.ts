// app/api/lessons/[lessonId]/content/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      select: { content: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json({ content: lesson.content || 'No content available' });
  } catch (error) {
    console.error('Failed to fetch lesson content', error);
    return NextResponse.json({ error: 'Failed to fetch lesson content' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { lessonId: string } }) {
  try {
    const { content } = await request.json();
    const updatedLesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: { content },
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Failed to update lesson content', error);
    return NextResponse.json({ error: 'Failed to update lesson content' }, { status: 500 });
  }
}