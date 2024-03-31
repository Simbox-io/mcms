// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma, { User } from '@/lib/prisma';
import { uploadImage } from '@/lib/uploadImage';


export async function GET(request: NextRequest) {
  const session = auth();
    const userObj = await currentUser();


  if (!session.sessionId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userObj?.id },
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

export async function POST(request: NextRequest) {
  const session = auth();

  if (!session.sessionId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  console.log(data)
  const id = data.id as string;
  const username = data.username as string;
  const firstName = data.first_name as string || '';
  const lastName = data.last_name as string || '';
  const email = data.emailAddresses[0].emailAddress as string;
  const avatarUrl = data.profile_image_url as string || '';

  try {
    const newUser = await prisma.user.create({
      data: {
        id,
        username: username.toLowerCase(),
        firstName,
        lastName,
        email,
        avatar: avatarUrl,
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = auth();
    const userObj = await currentUser();


  if (!session.sessionId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.formData();
  const username = data.get('username') as string;
  const firstName = data.get('firstName') as string || '';
  const lastName = data.get('lastName') as string || '';
  const email = data.get('email') as string;
  const bio = data.get('bio') as string || '';
  const avatarUrl = data.get('avatar') as string || '';

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userObj?.id },
      data: {
        username: username.toLowerCase(),
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