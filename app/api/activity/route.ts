// app/api/activity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalActivities = await prisma.activity.count({
      where: { userId: token.id },
    });
    const totalPages = Math.ceil(totalActivities / perPage);

    const activities = await prisma.activity.findMany({
      where: { userId: token.id },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ activities, totalPages });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}