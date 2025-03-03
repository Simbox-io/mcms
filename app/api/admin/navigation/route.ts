// app/api/admin/navigation/route.ts
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

  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  try {
    const where = location ? { location } : {};

    const menus = await cachedPrisma.navigationMenu.findMany({
      where,
      include: {
        items: {
          where: {
            parentId: null, // Get only root level items
          },
          include: {
            children: {
              include: {
                children: true, // Support up to 3 levels of nesting
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching navigation menus:', error);
    return NextResponse.json(
      { message: 'Error fetching navigation menus' },
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
    const { name, description, location } = await request.json();

    if (!name || !location) {
      return NextResponse.json(
        { message: 'Name and location are required' },
        { status: 400 }
      );
    }

    const menu = await cachedPrisma.navigationMenu.create({
      data: {
        name,
        description,
        location,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error creating navigation menu:', error);
    return NextResponse.json(
      { message: 'Error creating navigation menu' },
      { status: 500 }
    );
  }
}
