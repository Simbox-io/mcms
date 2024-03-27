// app/api/achievements/route.ts
import { NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const achievements = await cachedPrisma.achievement.findMany();
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Failed to fetch achievements', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}