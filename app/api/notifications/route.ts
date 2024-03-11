import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmailDigest, setEmailConfig } from '@/lib/email';
import { Notification } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';


// Set the email configuration
setEmailConfig({
  provider: 'ses',
  ses: {
    region: process.env.AWS_REGION!,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  from: process.env.EMAIL_FROM!,
});


export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    if (typeof user === 'object' && 'id' in user) {
      const totalNotifications = await prisma.notification.count({
        where: { userId: user.id },
      });

      const totalPages = Math.ceil(totalNotifications / perPage);

      const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ notifications, totalPages });
    }
    else {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        notifications: {
          where: {
            read: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const notificationsForEmail = user.notifications.map((notification: Notification) => ({
      ...notification,
      link: notification.link ?? undefined,
      createdAt: notification.createdAt.toISOString(),
    }));

    // Send the email digest
    await sendEmailDigest({ ...user, notifications: notificationsForEmail });

    return NextResponse.json({
      message: 'Email digest sent successfully',
      notifications: user.notifications,
    });
  } catch (error) {
    console.error('Error sending email digest:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}