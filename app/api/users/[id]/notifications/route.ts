// app/api/users/[id]/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const notifications = await cachedPrisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;
  const { notificationIds, isRead } = await request.json();

  try {
    const updatedNotifications = await cachedPrisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId,
      },
      data: {
        isRead,
      },
    });

    return NextResponse.json(updatedNotifications);
  } catch (error) {
    console.error('Error updating user notifications:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}