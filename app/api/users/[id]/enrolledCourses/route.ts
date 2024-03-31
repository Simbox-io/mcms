// app/api/users/[userId]/enrolledCourses/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const enrolledCourses = await prisma.enrollment.findMany({
      where: { studentId: params.id },
      include: { course: true },
    });
    return NextResponse.json(enrolledCourses);
  } catch (error) {
    console.error('Failed to fetch enrolled courses', error);
    return NextResponse.json({ error: 'Failed to fetch enrolled courses' }, { status: 500 });
  }
}