// app/api/site-navigation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define default navigation structure to return when database table is missing
const defaultNavigation = {
  "main": [
    { id: "home", label: "Home", path: "/", order: 1 },
    { id: "admin", label: "Admin", path: "/admin", order: 2 }
  ],
  "footer": [
    { id: "privacy", label: "Privacy Policy", path: "/privacy", order: 1 },
    { id: "terms", label: "Terms of Service", path: "/terms", order: 2 }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  try {
    // Check if the NavigationMenu table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'NavigationMenu'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('NavigationMenu table does not exist');
      // Return default navigation items
      if (location) {
        return NextResponse.json(defaultNavigation[location] || []);
      }
      return NextResponse.json(defaultNavigation);
    }
    
    // Check if the NavigationItem table exists
    const itemsTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'NavigationItem'
      );
    `;
    
    if (!itemsTableExists[0].exists) {
      console.log('NavigationItem table does not exist');
      if (location) {
        return NextResponse.json(defaultNavigation[location] || []);
      }
      return NextResponse.json(defaultNavigation);
    }
    
    // The tables exist, so try to get the navigation data
    try {
      if (location) {
        // Get navigation items for a specific location
        const menu = await prisma.navigationMenu.findFirst({
          where: { location },
          include: {
            items: {
              orderBy: { order: 'asc' }
            }
          }
        });
        
        if (menu && menu.items) {
          return NextResponse.json(menu.items);
        }
        
        // If no custom menu is found, return defaults for that location
        return NextResponse.json(defaultNavigation[location] || []);
      } else {
        // Get all navigation menus with items
        const menus = await prisma.navigationMenu.findMany({
          include: {
            items: {
              orderBy: { order: 'asc' }
            }
          }
        });
        
        if (menus && menus.length > 0) {
          // Transform the data to match the expected format
          const navigationByLocation = menus.reduce((acc, menu) => {
            acc[menu.location] = menu.items;
            return acc;
          }, {} as Record<string, any[]>);
          
          return NextResponse.json(navigationByLocation);
        }
        
        // Fall back to default navigation
        return NextResponse.json(defaultNavigation);
      }
    } catch (error) {
      console.error('Error querying navigation with Prisma:', error);
      
      // Try raw SQL as a fallback to handle schema mismatches
      try {
        let navigationData;
        
        if (location) {
          const menuData = await prisma.$queryRawUnsafe(`
            SELECT m.id as menu_id, m.location, i.id, i.label, i.path, i.order
            FROM "NavigationMenu" m
            JOIN "NavigationItem" i ON i."navigationMenuId" = m.id
            WHERE m.location = '${location.replace(/'/g, "''")}'
            ORDER BY i.order ASC
          `);
          
          navigationData = menuData || defaultNavigation[location] || [];
        } else {
          const menuData = await prisma.$queryRawUnsafe(`
            SELECT m.id as menu_id, m.location, i.id, i.label, i.path, i.order
            FROM "NavigationMenu" m
            JOIN "NavigationItem" i ON i."navigationMenuId" = m.id
            ORDER BY m.location, i.order ASC
          `);
          
          // Transform into expected structure
          navigationData = menuData.reduce((acc: Record<string, any[]>, item: any) => {
            if (!acc[item.location]) {
              acc[item.location] = [];
            }
            
            acc[item.location].push({
              id: item.id,
              label: item.label,
              path: item.path,
              order: item.order
            });
            
            return acc;
          }, {});
          
          // If no data found, use defaults
          if (Object.keys(navigationData).length === 0) {
            navigationData = defaultNavigation;
          }
        }
        
        return NextResponse.json(navigationData);
      } catch (sqlError) {
        console.error('Error with raw SQL navigation query:', sqlError);
        // Fallback to defaults on SQL error as well
        if (location) {
          return NextResponse.json(defaultNavigation[location] || []);
        }
        return NextResponse.json(defaultNavigation);
      }
    }
  } catch (error) {
    console.error('Error fetching site navigation items:', error);
    // Return a default navigation structure on any error
    const url = new URL(request.url);
    const location = url.searchParams.get('location');
    
    if (location) {
      return NextResponse.json(defaultNavigation[location] || []);
    }
    return NextResponse.json(defaultNavigation);
  }
}
