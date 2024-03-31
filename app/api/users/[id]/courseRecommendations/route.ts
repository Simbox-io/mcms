// app/api/users/[userId]/courseRecommendations/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const courseRecommendations = await prisma.courseRecommendation.findMany({
      where: { userId: params.userId },
      include: { course: true },
      orderBy: { score: 'desc' },
      take: 5,
    });
    return NextResponse.json(courseRecommendations);
  } catch (error) {
    console.error('Failed to fetch course recommendations', error);
    return NextResponse.json({ error: 'Failed to fetch course recommendations' }, { status: 500 });
  }
}