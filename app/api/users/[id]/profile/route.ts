// app/api/users/[id]/profile/route.ts
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
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        socialLinks: true,
        skills: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
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
  const { bio, location, website, socialLinks, skills } = await request.json();

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        bio,
        location,
        website,
        socialLinks: {
          deleteMany: {},
          createMany: {
            data: socialLinks,
          },
        },
        skills: {
          deleteMany: {},
          createMany: {
            data: skills,
          },
        },
      },
      include: {
        socialLinks: true,
        skills: true,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}