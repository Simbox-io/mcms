import { NextRequest, NextResponse } from 'next/server';
import { useSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { data: session } = await useSession();
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      select: { id: true, message: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}