// app/api/admin/settings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// New route structure
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const adminSettings = await prisma.adminSettings.findUnique({
    where: { userId: user.id },
  });

  return NextResponse.json(adminSettings);
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { siteTitle, siteDescription, logo, accentColor, fileStorageProvider } = await request.json();

  try {
    const updatedSettings = await prisma.adminSettings.upsert({
      where: { userId: user.id },
      update: {
        siteTitle,
        siteDescription,
        logo,
        accentColor,
        fileStorageProvider,
      },
      create: {
        userId: user.id,
        siteTitle,
        siteDescription,
        logo,
        accentColor,
        fileStorageProvider,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.adminSettings.delete({
      where: { userId: user.id },
    });

    return NextResponse.json({ message: 'Admin settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// Old route structure
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const adminSettings = await prisma.adminSettings.findUnique({
      where: { userId: user.id },
    });
    res.json(adminSettings);
  } else if (req.method === 'PUT') {
    const { siteTitle, siteDescription, logo, accentColor, fileStorageProvider } = req.body;
    const updatedSettings = await prisma.adminSettings.upsert({
      where: { userId: user.id },
      update: {
        siteTitle,
        siteDescription,
        logo,
        accentColor,
        fileStorageProvider,
      },
      create: {
        userId: user.id,
        siteTitle,
        siteDescription,
        logo,
        accentColor,
        fileStorageProvider,
      },
    });
    res.json(updatedSettings);
  } else if (req.method === 'DELETE') {
    await prisma.adminSettings.delete({
      where: { userId: user.id },
    });
    res.json({ message: 'Admin settings deleted successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}