// app/api/users/[id]/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
      include: {
        notificationPreferences: true,
        privacySettings: true,
        passwordResetSettings: true,
        accountDeletionSettings: true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
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
  const {
    notificationPreferences,
    privacySettings,
    languagePreference,
    themePreference,
    emailVerified,
    passwordResetSettings,
    accountDeletionSettings,
  } = await request.json();

  try {
    const updatedSettings = await prisma.userSettings.update({
      where: { userId },
      data: {
        notificationPreferences: notificationPreferences
          ? {
              update: {
                email: notificationPreferences.email,
                push: notificationPreferences.push,
                inApp: notificationPreferences.inApp,
              },
            }
          : undefined,
        privacySettings: privacySettings
          ? {
              update: {
                profileVisibility: privacySettings.profileVisibility,
                activityVisibility: privacySettings.activityVisibility,
              },
            }
          : undefined,
        languagePreference,
        themePreference,
        emailVerified,
        passwordResetSettings: passwordResetSettings
          ? {
              update: passwordResetSettings,
            }
          : undefined,
        accountDeletionSettings: accountDeletionSettings
          ? {
              update: accountDeletionSettings,
            }
          : undefined,
      },
      include: {
        notificationPreferences: true,
        privacySettings: true,
        passwordResetSettings: true,
        accountDeletionSettings: true,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}