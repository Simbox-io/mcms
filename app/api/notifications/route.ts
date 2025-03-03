// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

// Mock notifications for testing until we have a real notifications model
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Welcome to MCMS',
    message: 'Thank you for using MCMS! Check out the documentation to get started.',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'New Feature Available',
    message: 'We\'ve added a new post management feature. Try it out!',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  }
];

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
    // Return mock notifications for now
    const totalNotifications = MOCK_NOTIFICATIONS.length;
    const totalPages = Math.ceil(totalNotifications / perPage);

    return NextResponse.json({ 
      notifications: MOCK_NOTIFICATIONS,
      totalPages,
      unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length
    });
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

  try {
    const { title, message, link } = await request.json();

    // In a real implementation, we would create a new notification in the database
    // For now, just return a mock response
    const newNotification = {
      id: String(Date.now()),
      title,
      message,
      link,
      read: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ message: 'Error creating notification' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, read } = await request.json();

    // In a real implementation, we would update the notification in the database
    // For now, just return a mock response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ message: 'Error updating notification' }, { status: 500 });
  }
}