// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

// pages/api/admin/settings.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const adminSettings = await prisma.adminSettings.findUnique({
      where: { id: 'your-admin-settings-id' },
    });
    res.json(adminSettings);
  } else if (req.method === 'PUT') {
    const { isAIEnabled } = req.body;
    const updatedSettings = await prisma.adminSettings.update({
      where: { id: 'your-admin-settings-id' },
      data: { isAIEnabled },
    });
    res.json(updatedSettings);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { siteTitle, siteDescription, logo, accentColor, fileStorageProvider } = await request.json();

  try {
    const updatedSettings = await prisma.adminSettings.update({
      where: { id: 1 },
      data: {
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