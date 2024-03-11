// app/api/onboarding/follow/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request }) as User;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { type, id } = await request.json();

  try {
    if (type === 'wiki') {
      await prisma.user.update({
        where: { email: token.email },
        data: {
          wikis: {
            connect: { id },
          },
        },
      });
    } else if (type === 'user') {
      await prisma.user.update({
        where: { email: token.email },
        data: {
          following: {
            connect: { id },
          },
        },
      });
    }

    return NextResponse.json({ message: 'Followed successfully' });
  } catch (error) {
    console.error('Error following suggestion:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}