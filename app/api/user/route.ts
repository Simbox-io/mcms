// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { UserJSON } from '@clerk/nextjs/server';
import { Webhook } from 'svix';


export async function GET(request: NextRequest) {
  const session = auth();
  const userObj = await currentUser();

  console.log(request);

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
  const wh = new Webhook(process.env.USER_WEBHOOK_KEY!);
  const svix_id = request.headers.get("svix-id") ?? "";
  const svix_timestamp = request.headers.get("svix-timestamp") ?? "";
  const svix_signature = request.headers.get("svix-signature") ?? "";
  const rawBody = await request.text();
  const payload = wh.verify(rawBody, {
    "svix-id": svix_id,
    "svix-timestamp": svix_timestamp,
    "svix-signature": svix_signature,
  }) as UserJSON;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log(payload)
  const id = payload.id as string;
  const username = payload.username as string;
  const firstName = payload.first_name as string || '';
  const lastName = payload.last_name as string || '';
  const email = payload.email_addresses[0].email_address as string;
  const avatarUrl = payload.image_url as string || '';

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }
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


  if (!session) {
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