// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs';

export async function GET(request: NextRequest) {
  const session = auth();
    const userObj = await currentUser();

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: search || '', mode: 'insensitive' } },
          { email: { contains: search || '', mode: 'insensitive' } },
          { firstName: { contains: search || '', mode: 'insensitive' } },
          { lastName: { contains: search || '', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        profile: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
