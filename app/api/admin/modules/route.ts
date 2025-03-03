// app/api/admin/modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const modules = await cachedPrisma.moduleConfig.findMany({
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { message: 'Error fetching modules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      name,
      slug,
      description,
      isEnabled,
      icon,
      settings,
      permissions,
      requiredRole,
      adminRoute,
      displayOrder,
    } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if a module with this slug already exists
    const existingModule = await cachedPrisma.moduleConfig.findUnique({
      where: { slug },
    });

    if (existingModule) {
      return NextResponse.json(
        { message: 'A module with this slug already exists' },
        { status: 400 }
      );
    }

    const module = await cachedPrisma.moduleConfig.create({
      data: {
        name,
        slug,
        description,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        icon,
        settings,
        permissions,
        requiredRole,
        adminRoute,
        displayOrder: displayOrder !== undefined ? displayOrder : 0,
      },
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { message: 'Error creating module' },
      { status: 500 }
    );
  }
}
