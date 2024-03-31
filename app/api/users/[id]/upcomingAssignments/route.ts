// app/api/users/[userId]/upcomingAssignments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const upcomingAssignments = await prisma.assignment.findMany({
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
    return NextResponse.json(upcomingAssignments);
  } catch (error) {
    console.error('Failed to fetch upcoming assignments', error);
    return NextResponse.json({ error: 'Failed to fetch upcoming assignments' }, { status: 500 });
  }
}