import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmailDigest, setEmailConfig } from '@/lib/email';
import { getSession } from '../../../lib/auth';
import { useToken } from '@/lib/useToken';

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
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalNotifications = await prisma.notification.count({
      where: { userId: token.id },
    });
    const totalPages = Math.ceil(totalNotifications / perPage);

    const notifications = await prisma.notification.findMany({
      where: { userId: token.id },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ notifications, totalPages });
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

    user.notifications = user.notifications.map(notification => ({
      ...notification,
      createdAt: notification.createdAt.toISOString(),
    }));

    // Send the email digest
    await sendEmailDigest(user);

    return NextResponse.json({
      message: 'Email digest sent successfully',
      notifications: user.notifications,
    });
  } catch (error) {
    console.error('Error sending email digest:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}