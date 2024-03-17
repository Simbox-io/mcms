// app/api/onboarding/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await request.json();

  try {
    if (type === 'space') {
      await prisma.user.update({
        where: { id: userObj.id },
        data: {
          collaboratedSpaces: {
            connect: { id },
          },
        },
      });
    } else if (type === 'user') {
      await prisma.user.update({
        where: { id: userObj.id },
        data: {
          following: {
            connect: { id },
          },
        },
      });
    } else {
      return NextResponse.json({ message: 'Invalid follow type' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}