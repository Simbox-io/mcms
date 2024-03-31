// app/api/users/[userId]/upcomingQuizzes/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const upcomingQuizzes = await prisma.quiz.findMany({
      where: {
        lesson: {
          course: {
            enrollments: {
              some: {
                studentId: params.userId,
              },
            },
          },
        },
        dueDate: {
          gte: new Date(),
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
    return NextResponse.json(upcomingQuizzes);
  } catch (error) {
    console.error('Failed to fetch upcoming quizzes', error);
    return NextResponse.json({ error: 'Failed to fetch upcoming quizzes' }, { status: 500 });
  }
}