// app/api/admin/settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, logo, favicon } = await request.json();

  try {
    const updatedSettings = await prisma.siteSettings.update({
      where: { id: 1 },
      data: {
        title,
        description,
        logo,
        favicon,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}