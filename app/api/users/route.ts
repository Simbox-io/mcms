// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    const users = await cachedPrisma.user.findMany({
      where: {
        OR: [
          { username: { contains: search || '', mode: 'insensitive' } },
          { email: { contains: search || '', mode: 'insensitive' } },
          { first_name: { contains: search || '', mode: 'insensitive' } },
          { last_name: { contains: search || '', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        first_name: true,
        last_name: true,
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
