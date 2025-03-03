// app/api/admin/navigation/items/[itemId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { itemId } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const item = await cachedPrisma.navigationItem.findUnique({
      where: { id: itemId },
      include: {
        children: {
          include: {
            children: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { message: 'Navigation item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
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
  { params }: { params: { itemId: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { itemId } = params;

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

    // Verify the item exists
    const existingItem = await cachedPrisma.navigationItem.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // If parentId is provided, verify it exists and belongs to this menu
    // Also ensure it's not setting a child as its own parent
    if (parentId && parentId !== existingItem.parentId) {
      if (parentId === itemId) {
        return NextResponse.json(
          { message: 'An item cannot be its own parent' },
          { status: 400 }
        );
      }

      const parentItem = await cachedPrisma.navigationItem.findUnique({
        where: { id: parentId },
      });

      if (!parentItem) {
        return NextResponse.json(
          { message: 'Parent item not found' },
          { status: 404 }
        );
      }

      if (parentItem.menuId !== existingItem.menuId) {
        return NextResponse.json(
          { message: 'Parent item does not belong to the same menu' },
          { status: 400 }
        );
      }

      // Check for circular references
      // If the new parent is a descendant of this item, we'll have a circular reference
      let currentParent = parentItem;
      while (currentParent.parentId) {
        if (currentParent.parentId === itemId) {
          return NextResponse.json(
            { message: 'Cannot set a child or descendant as a parent (circular reference)' },
            { status: 400 }
          );
        }

        currentParent = await cachedPrisma.navigationItem.findUnique({
          where: { id: currentParent.parentId },
        }) as any;
      }
    }

    // If targetModule is provided, verify it exists
    if (targetModule && targetModule !== existingItem.targetModule) {
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

    const updateData: any = {};
    if (title) updateData.title = title;
    if (url !== undefined) updateData.url = url;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (openInNewTab !== undefined) updateData.openInNewTab = openInNewTab;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (requiresAuth !== undefined) updateData.requiresAuth = requiresAuth;
    if (requiredRole !== undefined) updateData.requiredRole = requiredRole;
    if (isEnabled !== undefined) updateData.isEnabled = isEnabled;
    if (targetModule !== undefined) updateData.targetModule = targetModule;

    const item = await cachedPrisma.navigationItem.update({
      where: { id: itemId },
      data: updateData,
    });

    return NextResponse.json(item);
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
  { params }: { params: { itemId: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { itemId } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the item exists
    const existingItem = await cachedPrisma.navigationItem.findUnique({
      where: { id: itemId },
      include: {
        children: true,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // First, recursively delete all children
    const deleteChildren = async (itemId: string) => {
      const children = await cachedPrisma.navigationItem.findMany({
        where: { parentId: itemId },
      });

      for (const child of children) {
        await deleteChildren(child.id);
      }

      await cachedPrisma.navigationItem.deleteMany({
        where: { parentId: itemId },
      });
    };

    await deleteChildren(itemId);

    // Then delete the item itself
    await cachedPrisma.navigationItem.delete({
      where: { id: itemId },
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
