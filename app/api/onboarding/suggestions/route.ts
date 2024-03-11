// app/api/onboarding/suggestions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const suggestedWikis = await prisma.wiki.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
      },
    });

    const suggestedUsers = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    return NextResponse.json({ wikis: suggestedWikis, users: suggestedUsers });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}