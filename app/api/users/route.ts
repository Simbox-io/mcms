// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      bio: true,
      role: true,
      posts: true,
      comments: true,
      files: true,
      ownedProjects: true,
      memberProjects: true,
      spaces: true,
      followedBy: true,
      following: true,
      viewedSpaces: true,
      permissions: true,
      grantedPermissions: true,
      notifications: true,
      activities: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      points: true,
      badges: true,
      level: true,
      receiveNotifications: true,
      receiveUpdates: true,
    }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}