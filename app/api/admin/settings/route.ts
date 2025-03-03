import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default settings 
const DEFAULT_SETTINGS = {
  siteTitle: 'MCMS',
  siteDescription: 'Modern Content Management System',
  logo: '/logo.png',
  accentColor: '#3182CE',
  enableUserRegistration: true,
  requireEmailVerification: false,
  requireAccountApproval: false,
  fileStorageProvider: 'local',
  maxFileSize: 10, // in MB
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx'],
};

export async function GET() {
  try {
    // Check if SiteSettings table exists before doing anything
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'SiteSettings'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('SiteSettings table does not exist');
      return NextResponse.json({ 
        id: "default",
        title: "MCMS",
        description: "Modern Content Management System",
        enableUserRegistration: true,
        requireEmailVerification: false
      });
    }
    
    // Get column information directly
    const columnsInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'SiteSettings'
    `;
    
    const columns = columnsInfo.map((col: any) => col.column_name.toLowerCase());
    console.log('Available SiteSettings columns:', columns);
    
    // Fallback to simple raw query instead of Prisma model
    try {
      // Construct a raw query with only the columns that exist
      const rawColumnsStr = columnsInfo
        .map((col: any) => `"${col.column_name}"`)
        .join(', ');
      
      // Only proceed if we have at least one column
      if (rawColumnsStr) {
        const rawSettings = await prisma.$queryRawUnsafe(`
          SELECT ${rawColumnsStr} FROM "SiteSettings" LIMIT 1
        `);
        
        if (rawSettings && rawSettings.length > 0) {
          return NextResponse.json(rawSettings[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching settings with raw SQL:', error);
    }
    
    // Return default settings as fallback
    return NextResponse.json({
      id: "default",
      title: "MCMS",
      description: "Modern Content Management System",
      enableUserRegistration: true,
      requireEmailVerification: false,
      requireAccountApproval: false,
      fileStorageProvider: "local",
      maxFileSize: 10,
      allowedFileTypes: ["jpg", "jpeg", "png", "gif", "pdf"]
    });
    
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default values on error
    return NextResponse.json({
      id: "default",
      title: "MCMS",
      description: "Modern Content Management System"
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);
    const user = session?.user as User;
    if (!session || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // First, check what columns we have in the table
    const columnsInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'SiteSettings'
    `;
    
    const columns = columnsInfo.map((col: any) => col.column_name.toLowerCase());
    console.log('Available SiteSettings columns for update:', columns);
    
    // Filter data to only include columns that exist in the database
    const filteredData: any = {};
    Object.entries(data).forEach(([key, value]) => {
      // Convert camelCase to lowercase for comparison
      const keyLower = key.toLowerCase();
      if (columns.includes(keyLower) || columns.includes(`${keyLower}`)) {
        filteredData[key] = value;
      }
    });
    
    // Check if SiteSettings table has any rows
    const count = await prisma.$queryRaw`
      SELECT COUNT(*) FROM "SiteSettings"
    `;
    
    let settings;
    const hasRows = count[0].count > 0;
    
    if (hasRows) {
      // Update existing settings
      try {
        // Get the first row's ID
        const firstRow = await prisma.$queryRaw`
          SELECT id FROM "SiteSettings" LIMIT 1
        `;
        
        const id = firstRow[0].id;
        
        // Use Prisma to update
        settings = await prisma.siteSettings.update({
          where: { id },
          data: filteredData
        });
      } catch (error) {
        console.error('Error updating with Prisma:', error);
        
        // Fall back to raw SQL if needed
        const updates = Object.entries(filteredData)
          .map(([key, value]) => {
            if (value === null) {
              return `"${key}" = NULL`;
            } else if (typeof value === 'string') {
              return `"${key}" = '${value.replace(/'/g, "''")}'`;
            } else if (Array.isArray(value)) {
              // Handle array values (like allowedFileTypes)
              const arrayStr = JSON.stringify(value).replace(/'/g, "''");
              return `"${key}" = '${arrayStr}'::jsonb`;
            } else {
              return `"${key}" = ${value}`;
            }
          })
          .join(', ');
        
        await prisma.$executeRawUnsafe(`
          UPDATE "SiteSettings" 
          SET ${updates}, "updatedAt" = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM "SiteSettings" LIMIT 1)
        `);
        
        // Fetch the updated record
        settings = await prisma.$queryRaw`
          SELECT * FROM "SiteSettings" LIMIT 1
        `;
        settings = settings[0];
      }
    } else {
      // Create new settings
      try {
        // Ensure id is provided for new record
        if (!filteredData.id) {
          filteredData.id = 'default';
        }
        
        settings = await prisma.siteSettings.create({
          data: filteredData
        });
      } catch (error) {
        console.error('Error creating with Prisma:', error);
        
        // Fall back to raw SQL
        const columns = Object.keys(filteredData).map(k => `"${k}"`).join(', ');
        const values = Object.values(filteredData).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
          if (Array.isArray(v)) return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
          return v;
        }).join(', ');
        
        await prisma.$executeRawUnsafe(`
          INSERT INTO "SiteSettings" (${columns}, "createdAt", "updatedAt") 
          VALUES (${values}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `);
        
        // Fetch the created record
        settings = await prisma.$queryRaw`
          SELECT * FROM "SiteSettings" LIMIT 1
        `;
        settings = settings[0];
      }
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    const user = session?.user as User;
    if (!session || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete all settings and reset to defaults
    await cachedPrisma.siteSettings.deleteMany({});
    
    return NextResponse.json({ message: 'Settings reset to defaults', settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Error deleting settings:', error);
    return NextResponse.json({ message: 'Error resetting settings' }, { status: 500 });
  }
}