// app/api/admin/site-navigation/route.ts
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
    const menus = await cachedPrisma.menuNavigation.findMany({
      include: {
        items: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    
    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching site navigation menus:', error);
    return NextResponse.json(
      { message: 'Error fetching site navigation menus' },
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
    const data = await request.json();
    const { name, description, location } = data;

    if (!name || !location) {
      return NextResponse.json(
        { message: 'Name and location are required' },
        { status: 400 }
      );
    }

    const menu = await cachedPrisma.menuNavigation.create({
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
