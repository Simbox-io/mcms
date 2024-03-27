import { NextResponse } from 'next/server';
import cachedPrisma, { User } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: Request, { params }: { params: { assignmentId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = session.user as User;
    const assignmentId = params.assignmentId;
    const { solution } = await request.json();

    // Check if the user has already submitted a solution for this assignment
    const existingSubmission = await cachedPrisma.assignmentSubmission.findFirst({
      where: {
        userId: user.id,
        assignmentId,
      },
    });

    if (existingSubmission) {
      return NextResponse.json({ message: 'Already submitted' });
    }

    // Create a new assignment submission
    const submission = await cachedPrisma.assignmentSubmission.create({
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