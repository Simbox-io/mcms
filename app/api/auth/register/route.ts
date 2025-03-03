// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import cachedPrisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const { email, password, username } = await request.json();

  try {
    const existingUser = await cachedPrisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already exists.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await cachedPrisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        firstName: '',
        lastName: '',
        settings: {
          create: {
            emailVerified: false,
            notificationPreferences: {
              create: {
                email: true,
                push: true,
                inApp: true,
              },
            },
            privacySettings: {
              create: {
                profileVisibility: 'PUBLIC',
                activityVisibility: 'PUBLIC',
              },
            },
          },
        },
        profile: {
          create: {},
        },
      },
    });

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration.' }, { status: 500 });
  }
}