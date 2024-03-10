// app/api/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { uploadImage } from '@/lib/uploadImage';

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, email: true, avatar: true, bio: true },
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
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const bio = formData.get('bio') as string;
  const avatar = formData.get('avatar') as File | null;

  try {
    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadImage(avatar);
    }

    const updatedUser = await prisma.user.update({
      where: { email: token.email },
      data: {
        username,
        email,
        bio,
        avatar: avatarUrl,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}