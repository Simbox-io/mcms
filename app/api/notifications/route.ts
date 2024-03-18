// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalNotifications = await prisma.notification.count({
      where: { userId: userObj.id },
    });
    const totalPages = Math.ceil(totalNotifications / perPage);

    const notifications = await prisma.notification.findMany({
      where: { userId: userObj.id },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        settings: {
          include: {
            commentSettings: true,
          },
        },
      },
    });

    return NextResponse.json({ notifications, totalPages });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { message, link, settings } = await request.json();

  try {
    const newNotification = await prisma.notification.create({
      data: {
        user: { connect: { id: userObj.id } },
        message,
        link,
        settings: {
          create: {
            channels: settings?.channels || [],
            frequency: settings?.frequency || 'default',
            commentSettings: {
              create: {
                notifyAuthor: settings?.commentSettings?.notifyAuthor || false,
                notifyCommenters: settings?.commentSettings?.notifyCommenters || false,
                postSettings: settings?.commentSettings?.postSettings || 'default',
              },
            },
            preferences: settings?.preferences || 'default',
            templates: settings?.templates || 'default',
          },
        },
      },
    });

    
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}