// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userObj.id },
      include: {
        profile: true,
        settings: {
          include: {
            notificationPreferences: true,
            privacySettings: true,
            passwordResetSettings: true,
            accountDeletionSettings: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('User data fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { username, firstName, lastName, email, bio, avatar } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userObj.id },
      data: {
        username,
        firstName,
        lastName,
        email,
        bio,
        avatar,
        profile: {
          update: {
            bio,
          },
        },
      },
      include: {
        profile: true,
        settings: {
          include: {
            notificationPreferences: true,
            privacySettings: true,
            passwordResetSettings: true,
            accountDeletionSettings: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}