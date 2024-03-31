import { NextResponse } from 'next/server';
import prisma, { User } from '@/lib/prisma';
import { auth } from '@clerk/nextjs';

export async function POST(request: Request, { params }: { params: { assignmentId: string } }) {
  const session = auth()

  if (!session.sessionId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = session.user as unknown as User;
    const assignmentId = params.assignmentId;
    const { solution } = await request.json();

    // Check if the user has already submitted a solution for this assignment
    const existingSubmission = await prisma.assignmentSubmission.findFirst({
      where: {
        userId: user.id,
        assignmentId,
      },
    });

    if (existingSubmission) {
      return NextResponse.json({ message: 'Already submitted' });
    }

    // Create a new assignment submission
    const submission = await prisma.assignmentSubmission.create({
      data: {
        user: { connect: { id: user.id } },
        assignment: { connect: { id: assignmentId } },
        solution,
      },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Failed to submit assignment solution', error);
    return NextResponse.json({ error: 'Failed to submit assignment solution' }, { status: 500 });
  }
}