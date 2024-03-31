// app/api/onboarding/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { receiveNotifications, receiveUpdates, languagePreference, themePreference } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userObj.id },
      data: {
        settings: {
          update: {
            notificationPreferences: {
              update: {
                email: receiveNotifications,
                push: receiveNotifications,
                inApp: receiveNotifications,
              },
            },
            privacySettings: {
              update: {
                profileVisibility: 'PUBLIC',
                activityVisibility: 'PUBLIC',
              },
            },
            languagePreference,
            themePreference,
          },
        },
      },
      include: {
        settings: {
          include: {
            notificationPreferences: true,
            privacySettings: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}