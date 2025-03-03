// app/api/admin/navigation/items/[id]/route.ts
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

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const item = await cachedPrisma.navigationItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json(
        { message: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // Get the menu to determine location
    const menu = await cachedPrisma.navigationMenu.findUnique({
      where: { id: item.menuId },
    });

    return NextResponse.json({
      ...item,
      location: menu?.location,
    });
  } catch (error) {
    console.error('Error fetching navigation item:', error);
    return NextResponse.json(
      { message: 'Error fetching navigation item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      location,
    } = data;

    // First, check if the item exists
    const existingItem = await cachedPrisma.navigationItem.findUnique({
      where: { id: params.id },
      include: { navigationMenu: true },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // Check if we need to change the menu (location changed)
    let menuId = existingItem.menuId;
    if (location && location !== existingItem.navigationMenu.location) {
      // Find or create menu for the new location
      let menu = await cachedPrisma.navigationMenu.findFirst({
        where: { location },
      });

      if (!menu) {
        menu = await cachedPrisma.navigationMenu.create({
          data: {
            name: `${location.charAt(0).toUpperCase() + location.slice(1)} Menu`,
            description: `Navigation for ${location}`,
            location,
          },
        });
      }
      menuId = menu.id;
    }

    // Update the item
    const updatedItem = await cachedPrisma.navigationItem.update({
      where: { id: params.id },
      data: {
        title,
        url,
        icon,
        order,
        openInNewTab: openInNewTab !== undefined ? openInNewTab : existingItem.openInNewTab,
        requiresAuth: requiresAuth !== undefined ? requiresAuth : existingItem.requiresAuth,
        requiredRole,
        isEnabled: isEnabled !== undefined ? isEnabled : existingItem.isEnabled,
        menuId,
      },
    });

    // Get the menu to return location in the response
    const menu = await cachedPrisma.navigationMenu.findUnique({
      where: { id: updatedItem.menuId },
    });

    return NextResponse.json({
      ...updatedItem,
      location: menu?.location,
    });
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json(
      { message: 'Error updating navigation item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the item exists
    const existingItem = await cachedPrisma.navigationItem.findUnique({
      where: { id: params.id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // Delete the item
    await cachedPrisma.navigationItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Navigation item deleted successfully' });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return NextResponse.json(
      { message: 'Error deleting navigation item' },
      { status: 500 }
    );
  }
}
