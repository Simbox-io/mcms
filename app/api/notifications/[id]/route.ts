// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const notificationId = params.id;
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        settings: {
          include: {
            commentSettings: true,
          },
        },
      },
    });

    if (!notification || notification.userId !== userObj.id) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const notificationId = params.id;
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { isRead, isHidden, settings } = await request.json();

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userObj.id) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead,
        isHidden: isHidden || false,
        settings: settings
          ? {
              update: {
                channels: settings.channels,
                frequency: settings.frequency,
                commentSettings: settings.commentSettings
                  ? {
                      update: {
                        notifyAuthor: settings.commentSettings.notifyAuthor,
                        notifyCommenters: settings.commentSettings.notifyCommenters,
                      },
                    }
                  : undefined,
                preferences: settings.preferences,
                templates: settings.templates,
              },
            }
          : undefined,
      },
      include: {
        settings: {
          include: {
            commentSettings: true,
          },
        },
      },
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const notificationId = params.id;
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userObj.id) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}