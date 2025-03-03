// app/api/admin/navigation/items/route.ts
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
    // Get all navigation items
    const where = location ? { location } : {};
    
    // First, get all menus
    const menus = await cachedPrisma.navigationMenu.findMany();
    
    // Then get all items from all menus
    const items = await Promise.all(
      menus.map(async (menu) => {
        const menuItems = await cachedPrisma.navigationItem.findMany({
          where: { menuId: menu.id },
          orderBy: { order: 'asc' },
        });
        
        // Add location from the menu to each item
        return menuItems.map(item => ({
          ...item,
          location: menu.location,
        }));
      })
    );
    
    // Flatten the array of arrays
    const flattenedItems = items.flat();
    
    // Filter by location if specified
    const filteredItems = location 
      ? flattenedItems.filter(item => item.location === location)
      : flattenedItems;
    
    return NextResponse.json(filteredItems);
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
      location,
    } = data;

    // First, find or create the menu for this location
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

    // Create the navigation item
    const item = await cachedPrisma.navigationItem.create({
      data: {
        title,
        url,
        icon,
        order,
        openInNewTab: openInNewTab || false,
        requiresAuth: requiresAuth || false,
        requiredRole,
        isEnabled: isEnabled !== false, // Default to true if not specified
        menuId: menu.id,
      },
    });

    // Return the created item with the location
    return NextResponse.json({
      ...item,
      location,
    });
  } catch (error) {
    console.error('Error creating navigation item:', error);
    return NextResponse.json(
      { message: 'Error creating navigation item' },
      { status: 500 }
    );
  }
}
