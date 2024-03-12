// app/api/onboarding/profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma, { User } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { username, bio, firstName, lastName } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: user.email },
      data: { username, firstName, lastName, bio },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}