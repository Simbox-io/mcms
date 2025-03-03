// app/api/admin/navigation/[id]/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { id } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the menu exists
    const menu = await cachedPrisma.navigationMenu.findUnique({
      where: { id },
    });

    if (!menu) {
      return NextResponse.json(
        { message: 'Navigation menu not found' },
        { status: 404 }
      );
    }

    const items = await cachedPrisma.navigationItem.findMany({
      where: {
        menuId: id,
      },
      orderBy: {
        order: 'asc',
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { id: menuId } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      title,
      url,
      icon,
      order,
      openInNewTab,
      parentId,
      requiresAuth,
      requiredRole,
      isEnabled,
      targetModule,
    } = await request.json();

    if (!title) {
      return NextResponse.json(
        { message: 'Title is required' },
        { status: 400 }
      );
    }

    // Verify the menu exists
    const menu = await cachedPrisma.navigationMenu.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      return NextResponse.json(
        { message: 'Navigation menu not found' },
        { status: 404 }
      );
    }

    // If parentId is provided, verify it exists and belongs to this menu
    if (parentId) {
      const parentItem = await cachedPrisma.navigationItem.findUnique({
        where: { id: parentId },
      });

      if (!parentItem) {
        return NextResponse.json(
          { message: 'Parent item not found' },
          { status: 404 }
        );
      }

      if (parentItem.menuId !== menuId) {
        return NextResponse.json(
          { message: 'Parent item does not belong to this menu' },
          { status: 400 }
        );
      }
    }

    // If targetModule is provided, verify it exists
    if (targetModule) {
      const module = await cachedPrisma.moduleConfig.findUnique({
        where: { slug: targetModule },
      });

      if (!module) {
        return NextResponse.json(
          { message: 'Target module not found' },
          { status: 404 }
        );
      }
    }

    const item = await cachedPrisma.navigationItem.create({
      data: {
        title,
        url,
        icon,
        order: order !== undefined ? order : 0,
        openInNewTab: openInNewTab !== undefined ? openInNewTab : false,
        menuId,
        parentId,
        requiresAuth: requiresAuth !== undefined ? requiresAuth : false,
        requiredRole,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
        targetModule,
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
