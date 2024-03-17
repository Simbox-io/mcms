// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma, { User } from '@/lib/prisma';
import { uploadImage } from '@/lib/uploadImage';


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
  const data = await request.formData();
  const username = data.get('username') as string;
  const firstName = data.get('firstName') as string || '';
  const lastName = data.get('lastName') as string || '';
  const email = data.get('email') as string;
  const bio = data.get('bio') as string || '';
  const avatar = data.get('avatar') as File || null;

  let avatarUrl;
  if (avatar) {
    try {
      avatarUrl = await uploadImage(avatar);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return NextResponse.json({ message: 'Failed to upload avatar' }, { status: 500 });
    }
  }
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userObj.id },
      data: {
        username,
        firstName,
        lastName,
        email,
        bio,
        avatar: avatarUrl,
        profile: {
          update: {
            bio,
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