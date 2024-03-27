import { NextResponse } from 'next/server';
import cachedPrisma, { User } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import authOptions from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: Request, { params }: { params: { quizId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = session.user as User;

    const quizId = params.quizId;
    const { answers } = await request.json();

    // Check if the user has already submitted answers for this quiz
    const existingSubmission = await cachedPrisma.quizSubmission.findFirst({
      where: {
        userId: user.id,
        quizId,
      },
    });

    if (existingSubmission) {
      return NextResponse.json({ message: 'Already submitted' });
    }

    // Create a new quiz submission
    const submission = await cachedPrisma.quizSubmission.create({
      data: {
        user: { connect: { id: user.id } },
        quiz: { connect: { id: quizId } },
        answers,
      },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Failed to submit quiz answers', error);
    return NextResponse.json({ error: 'Failed to submit quiz answers' }, { status: 500 });
  }
}