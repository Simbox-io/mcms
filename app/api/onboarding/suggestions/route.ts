// app/api/onboarding/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const suggestedSpaces = await prisma.space.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    const suggestedUsers = await prisma.user.findMany({
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