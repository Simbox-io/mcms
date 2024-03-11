// app/api/onboarding/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma, { User } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request }) as User;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { username, bio } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: { username, bio },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}