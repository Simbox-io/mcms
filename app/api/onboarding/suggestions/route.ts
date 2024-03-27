// app/api/onboarding/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const suggestedSpaces = await cachedPrisma.space.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const suggestedUsers = await cachedPrisma.user.findMany({
      take: 5,
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
      },
    });

    return NextResponse.json({ spaces: suggestedSpaces, users: suggestedUsers });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}