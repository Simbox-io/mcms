// app/api/users/[userId]/achievements/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: params.userId },
      include: { achievement: true },
    });
    return NextResponse.json(userAchievements);
  } catch (error) {
    console.error('Failed to fetch user achievements', error);
    return NextResponse.json({ error: 'Failed to fetch user achievements' }, { status: 500 });
  }
}