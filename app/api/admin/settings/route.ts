// app/api/admin/settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { User } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.adminSettings.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { siteTitle, siteDescription, logo, accentColor } = await request.json();

  try {
    const updatedSettings = await prisma.adminSettings.update({
      where: { id: 1 },
      data: {
        siteTitle,
        siteDescription,
        logo,
        accentColor,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}