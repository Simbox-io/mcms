// Simple seed script to create a test user
const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

async function ensureEnums(prisma) {
  console.log('Ensuring enum types exist...');
  
  try {
    // Check if Role enum exists
    const roleEnumExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'role'
      );
    `;
    
    if (!roleEnumExists[0].exists) {
      console.log('Creating Role enum...');
      await prisma.$executeRawUnsafe(`
        CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER', 'EDITOR', 'STUDENT');
      `);
    }
    
    // Check if SchoolRole enum exists
    const schoolRoleEnumExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'schoolrole'
      );
    `;
    
    if (!schoolRoleEnumExists[0].exists) {
      console.log('Creating SchoolRole enum...');
      await prisma.$executeRawUnsafe(`
        CREATE TYPE "public"."SchoolRole" AS ENUM ('TEACHER', 'STUDENT', 'STAFF');
      `);
    }
    
    console.log('Enum types verified.');
  } catch (error) {
    console.error('Error ensuring enum types:', error);
  }
}

async function seedUser() {
  console.log('Creating test user...');
  
  // Check if User table exists
  try {
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'User'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('User table does not exist, skipping...');
      return;
    }
    
    console.log('User table exists, proceeding with upsert...');
    
    // Get column information for User table
    const columnsInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User'
    `;
    
    const columns = columnsInfo.map(col => col.column_name.toLowerCase());
    console.log('Available User columns:', columns);
    
    // Check if Role enum exists
    const roleEnumExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'role'
      );
    `;
    
    const hashedPassword = await bcryptjs.hash('password123', 10);
    
    // Create raw SQL insert if enums are missing but create/use Prisma if available
    if (roleEnumExists[0].exists) {
      try {
        // Build a create object that only includes columns that exist
        const createData = {
          email: 'test@example.com',
          username: 'testuser',
          passwordHash: hashedPassword,
          role: 'ADMIN',
        };
        
        // Conditionally add fields only if they exist in the database
        if (columns.includes('firstname')) {
          createData.firstName = 'Test';
        }
        
        if (columns.includes('lastname')) {
          createData.lastName = 'User';
        }
        
        // Don't try to set avatar if it doesn't exist
        if (columns.includes('avatar')) {
          createData.avatar = null;
        }
        
        const testUser = await prisma.user.upsert({
          where: { email: 'test@example.com' },
          update: {},
          create: createData
        });
        
        console.log('Created test user:', testUser.email);
      } catch (error) {
        console.error('Error creating user with Prisma:', error);
        
        // Fallback to direct SQL insertion
        try {
          console.log('Trying direct SQL insertion...');
          // Create basic SQL query with only essential fields
          await prisma.$executeRawUnsafe(`
            INSERT INTO "User" (id, email, username, "passwordHash", role, "createdAt", "updatedAt") 
            VALUES (
              uuid_generate_v4(), 
              'test@example.com', 
              'testuser', 
              '${hashedPassword}', 
              'ADMIN', 
              CURRENT_TIMESTAMP, 
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (email) DO NOTHING;
          `);
          console.log('Created test user via direct SQL.');
        } catch (sqlError) {
          console.error('Error creating user with direct SQL:', sqlError);
        }
      }
    } else {
      console.log('Role enum does not exist, using direct SQL with text role...');
      try {
        await prisma.$executeRawUnsafe(`
          INSERT INTO "User" (id, email, username, "passwordHash", role, "createdAt", "updatedAt") 
          VALUES (
            uuid_generate_v4(), 
            'test@example.com', 
            'testuser', 
            '${hashedPassword}', 
            'ADMIN', 
            CURRENT_TIMESTAMP, 
            CURRENT_TIMESTAMP
          )
          ON CONFLICT (email) DO NOTHING;
        `);
        console.log('Created test user via direct SQL.');
      } catch (error) {
        console.error('Error creating user with direct SQL:', error);
      }
    }
    
    console.log('Login with:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

async function seedModuleConfig() {
  try {
    console.log('Creating module configurations...');
    
    // First check if the table exists and inspect its structure
    try {
      // Check if 'settings' column exists
      const tableInfo = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'ModuleConfig'
      `;
      
      const columnNames = tableInfo.map(col => col.column_name);
      console.log('ModuleConfig columns:', columnNames);
      
      const hasSettingsColumn = columnNames.includes('settings');
      if (!hasSettingsColumn) {
        console.log('Adding settings column to ModuleConfig table');
        try {
          await prisma.$executeRawUnsafe(`
            ALTER TABLE "ModuleConfig" 
            ADD COLUMN IF NOT EXISTS "settings" JSONB DEFAULT '{}'
          `);
          console.log('Settings column added successfully');
        } catch (alterError) {
          console.error('Could not add settings column:', alterError);
          // Continue anyway, just don't use the settings field
        }
      }
    } catch (error) {
      console.log('Error inspecting ModuleConfig table:', error);
    }

    const modules = [
      {
        name: 'Pages',
        slug: 'pages',
        description: 'Manage website pages',
        isEnabled: true,
        icon: 'document-text',
        adminRoute: '/admin/pages',
        displayOrder: 1
      },
      {
        name: 'Navigation',
        slug: 'navigation',
        description: 'Manage site navigation',
        isEnabled: true,
        icon: 'menu',
        adminRoute: '/admin/site-navigation',
        displayOrder: 2
      },
      {
        name: 'Media',
        slug: 'media',
        description: 'Manage media files',
        isEnabled: true,
        icon: 'photograph',
        adminRoute: '/admin/media',
        displayOrder: 3
      },
      {
        name: 'Users',
        slug: 'users',
        description: 'Manage users',
        isEnabled: true,
        icon: 'users',
        adminRoute: '/admin/users',
        displayOrder: 4
      },
      {
        name: 'Settings',
        slug: 'settings',
        description: 'Manage site settings',
        isEnabled: true,
        icon: 'cog',
        adminRoute: '/admin/settings',
        displayOrder: 5
      }
    ];
    
    for (const module of modules) {
      try {
        const data = { ...module };
        
        // Try to get the existing module first
        const existingModule = await prisma.moduleConfig.findUnique({
          where: { slug: module.slug }
        });
        
        if (existingModule) {
          // Update existing module without settings if column doesn't exist
          console.log(`Updating module: ${module.name}`);
          await prisma.moduleConfig.update({
            where: { id: existingModule.id },
            data
          });
        } else {
          // Create new module without settings if column doesn't exist
          console.log(`Creating module: ${module.name}`);
          await prisma.moduleConfig.create({
            data: {
              ...data,
              id: module.slug // Use slug as ID for new modules
            }
          });
        }
      } catch (moduleError) {
        console.error(`Error with module ${module.name}:`, moduleError);
      }
    }
    
    console.log('✅ Module configurations created/updated!');
  } catch (error) {
    console.error('Error creating module configurations:', error);
  }
}

async function createSiteSettings(prisma) {
  console.log('Creating site settings...');
  
  try {
    // First check if SiteSettings table exists and has the required columns
    try {
      // Get table info
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'SiteSettings'
        );
      `;
      
      if (!tableExists[0].exists) {
        console.log('SiteSettings table does not exist, skipping...');
        return;
      }
      
      // Check for existing settings without assuming specific columns
      const existingSettingsCount = await prisma.$queryRaw`
        SELECT COUNT(*) FROM "SiteSettings";
      `;
      
      const hasExistingSettings = existingSettingsCount[0].count > 0;
      
      if (hasExistingSettings) {
        console.log('Site settings already exist, updating...');
        
        // Update timestamp only to avoid errors with missing columns
        await prisma.$executeRawUnsafe(`
          UPDATE "SiteSettings" 
          SET "updatedAt" = CURRENT_TIMESTAMP
          WHERE "id" = 'default'
        `);
        
        console.log('Site settings updated.');
        return;
      }
    } catch (error) {
      console.log('Error checking for existing settings:', error);
      // Continue with creation attempt
    }
    
    // Get column information for SiteSettings table
    const columnsInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'SiteSettings'
    `;
    
    const columns = columnsInfo.map(col => col.column_name.toLowerCase());
    console.log('Available SiteSettings columns:', columns);
    
    // Build dynamic INSERT query
    const columnValues = [];
    const placeholders = [];
    
    // Always include id field
    columnValues.push('id');
    placeholders.push('\'default\'');
    
    // Always include timestamps
    if (columns.includes('createdat')) {
      columnValues.push('createdAt');
      placeholders.push('CURRENT_TIMESTAMP');
    }
    
    if (columns.includes('updatedat')) {
      columnValues.push('updatedAt');
      placeholders.push('CURRENT_TIMESTAMP');
    }
    
    // Add other common fields if they exist
    const commonFields = {
      'sitetitle': '\'MCMS\'',
      'sitedescription': '\'Modern Content Management System\'',
      'logo': '\'/images/logo.png\'',
      'favicon': '\'/images/favicon.ico\'',
      'primarycolor': '\'#3b82f6\'',
      'accentcolor': '\'#10b981\'',
      'enableuserregistration': 'true',
      'footertext': '\'Made with ❤️ using MCMS\'',
    };
    
    for (const [field, value] of Object.entries(commonFields)) {
      if (columns.includes(field)) {
        columnValues.push(field);
        placeholders.push(value);
      }
    }
    
    if (columnValues.length > 0) {
      const query = `
        INSERT INTO "SiteSettings" ("${columnValues.join('", "')}")
        VALUES (${placeholders.join(', ')})
        ON CONFLICT ("id") DO NOTHING
      `;
      
      console.log('Executing query:', query);
      
      try {
        await prisma.$executeRawUnsafe(query);
        console.log('Site settings created successfully.');
      } catch (insertError) {
        console.error('Error creating site settings:', insertError);
      }
    } else {
      console.log('No valid columns found for SiteSettings table.');
    }
  } catch (error) {
    console.error('Error creating site settings:', error);
  }
}

async function runPreSeedChecks() {
  try {
    console.log('Checking database tables...');
    const requiresDirectSQL = process.env.DIRECT_SQL === 'true';
    
    if (requiresDirectSQL) {
      // Manually check tables using SQL to avoid Prisma model mismatch
      console.log('Using direct SQL to create tables...');
      // Create ModuleConfig table
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "ModuleConfig" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "description" TEXT,
          "isEnabled" BOOLEAN NOT NULL DEFAULT true,
          "icon" TEXT,
          "adminRoute" TEXT,
          "displayOrder" INTEGER NOT NULL DEFAULT 0,
          "settings" JSONB DEFAULT '{}',
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ModuleConfig_pkey" PRIMARY KEY ("id")
        );
      `);

      // Create SiteSettings table
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "SiteSettings" (
          "id" TEXT NOT NULL,
          "siteTitle" TEXT NOT NULL DEFAULT 'MCMS',
          "siteDescription" TEXT NOT NULL DEFAULT 'Modern Content Management System',
          "logo" TEXT,
          "accentColor" TEXT,
          "enableUserRegistration" BOOLEAN NOT NULL DEFAULT true,
          "requireEmailVerification" BOOLEAN NOT NULL DEFAULT false,
          "requireAccountApproval" BOOLEAN NOT NULL DEFAULT false,
          "fileStorageProvider" TEXT NOT NULL DEFAULT 'local',
          "maxFileSize" INTEGER NOT NULL DEFAULT 10,
          "allowedFileTypes" TEXT[] DEFAULT ARRAY['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx'],
          "emailProvider" TEXT,
          "smtpHost" TEXT,
          "smtpPort" INTEGER,
          "smtpSecure" BOOLEAN NOT NULL DEFAULT false,
          "smtpAuthUser" TEXT,
          "smtpAuthPass" TEXT,
          "sesRegion" TEXT,
          "sesAccessKey" TEXT,
          "sesSecretAccessKey" TEXT,
          "emailFrom" TEXT,
          "footerText" TEXT,
          "copyrightText" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
        );
      `);
      console.log('Tables created/verified successfully using SQL.');
    } else {
      // Use Prisma to verify tables
      try {
        console.log('Checking if essential tables exist...');
        
        // Just check if we can query these tables
        await prisma.$executeRawUnsafe(`SELECT 1 FROM "ModuleConfig" LIMIT 1`);
        await prisma.$executeRawUnsafe(`SELECT 1 FROM "SiteSettings" LIMIT 1`);
        
        console.log('Essential tables exist.');
      } catch (error) {
        console.error('Table check failed:', error);
        
        // Run the pre-seed script
        console.log('Running pre-seed.js to ensure tables exist...');
        const { execSync } = require('child_process');
        try {
          execSync('node ./scripts/pre-seed.js', { stdio: 'inherit' });
        } catch (execError) {
          console.error('Failed to run pre-seed script:', execError);
          throw new Error('Database tables could not be verified or created.');
        }
      }
    }
  } catch (error) {
    console.error('Pre-seed check failed:', error);
    throw error;
  }
}

async function main() {
  console.log('Starting database seeding process...');
  
  // Ensure enum types exist before doing anything else
  await ensureEnums(prisma);
  
  // First run pre-seed checks to ensure the schema is ready
  await runPreSeedChecks();
  
  // Seed initial user
  await seedUser();
  
  // Seed module configuration
  await seedModuleConfig();
  
  // Seed site settings
  await createSiteSettings(prisma);
  
  console.log('Database seeding completed.')
}

main();
