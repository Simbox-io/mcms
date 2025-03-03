// app/api/navigation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  try {
    // Get all menus (or filter by location if specified)
    const where = location ? { location } : {};
    const menus = await cachedPrisma.navigationMenu.findMany({
      where,
    });

    // Then get all items from the menus
    const items = await Promise.all(
      menus.map(async (menu) => {
        const menuItems = await cachedPrisma.navigationItem.findMany({
          where: { 
            menuId: menu.id,
            // Only include enabled items by default
            isEnabled: true,
          },
          orderBy: { order: 'asc' },
        });
        
        // Add location from the menu to each item
        return menuItems.map(item => ({
          id: item.id,
          title: item.title,
          url: item.url,
          icon: item.icon,
          order: item.order,
          openInNewTab: item.openInNewTab,
          requiresAuth: item.requiresAuth,
          requiredRole: item.requiredRole,
          isEnabled: item.isEnabled,
          location: menu.location,
        }));
      })
    );
    
    // Flatten the array of arrays
    const flattenedItems = items.flat();
    
    return NextResponse.json(flattenedItems);
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    return NextResponse.json(
      { message: 'Error fetching navigation items' },
      { status: 500 }
    );
  }
}
