import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { User } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const session = auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { user } = session;
    const userObj = user as unknown as User;
    const courseId = params.courseId;

    // Check if the user is already enrolled in the course
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: userObj.id,
        courseId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ message: 'Already enrolled' });
    }

    // Create a new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        student: { connect: { id: userObj.id } },
        course: { connect: { id: courseId } },
      },
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error('Failed to enroll in course', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}