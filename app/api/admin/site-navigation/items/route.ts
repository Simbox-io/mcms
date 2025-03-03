// app/api/admin/site-navigation/items/route.ts
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
  const menuId = searchParams.get('menuId');

  try {
    const where = menuId ? { menuId } : {};
    
    const items = await cachedPrisma.menuNavItem.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        menu: true,
      },
    });
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    return NextResponse.json(
      { message: 'Error fetching navigation items' },
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
    const {
      title,
      url,
      icon,
      order,
      openInNewTab,
      requiresAuth,
      requiredRole,
      isEnabled,
      menuId,
    } = data;

    if (!title || !url || !menuId) {
      return NextResponse.json(
        { message: 'Title, URL, and menuId are required' },
        { status: 400 }
      );
    }

    // Check if the menu exists
    const menu = await cachedPrisma.menuNavigation.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      return NextResponse.json(
        { message: 'Menu not found' },
        { status: 404 }
      );
    }

    // Get highest order if not provided
    let itemOrder = order;
    if (itemOrder === undefined) {
      const highestOrder = await cachedPrisma.menuNavItem.findFirst({
        where: { menuId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      itemOrder = highestOrder ? highestOrder.order + 1 : 0;
    }

    const item = await cachedPrisma.menuNavItem.create({
      data: {
        title,
        url,
        icon,
        order: itemOrder,
        openInNewTab: openInNewTab || false,
        requiresAuth: requiresAuth || false,
        requiredRole,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        menuId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating navigation item:', error);
    return NextResponse.json(
      { message: 'Error creating navigation item' },
      { status: 500 }
    );
  }
}
