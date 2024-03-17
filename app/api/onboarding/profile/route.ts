// app/api/onboarding/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';
import { uploadImage } from '@/lib/uploadImage';

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  console.log('userObj:', userObj);
  if (!userObj) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const formData = await request.formData();
  const username = formData.get('username') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const bio = formData.get('bio') as string;
  const avatar = formData.get('avatar') as File | null;

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
        avatar: avatarUrl,
        bio,
        profile: {
          update: {
            bio,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}