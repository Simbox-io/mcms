// This script checks for missing tables and columns and creates or fixes them
const { exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

// Function to run shell commands as promises
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.warn(`Warning: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Checking database schema for missing tables and columns...');
    
    // First, check if we can introspect the database
    try {
      console.log('Introspecting database...');
      
      // Create a temporary schema file from the database
      execSync('npx prisma db pull --schema ./prisma/temp-schema.prisma', { stdio: 'inherit' });
      
      console.log('Database introspection successful.');
    } catch (introspectError) {
      console.error('Database introspection failed:', introspectError);
      console.log('Attempting to fix schema directly using SQL...');
      
      await fixSchemaDirect(prisma);
      return;
    }
    
    // Add missing columns directly using SQL
    await addMissingColumns(prisma);
    
    // Check for SiteSettings table structure and fix if necessary
    try {
      console.log('Checking SiteSettings table structure...');
      
      // Add missing columns or update constraints as needed
      await prisma.$executeRawUnsafe(`
        -- Make sure updatedAt has a default value and is not null
        DO $$
        BEGIN
          -- Check if the column exists
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'SiteSettings' AND column_name = 'updatedAt'
          ) THEN
            -- Ensure it has a default value and not null constraint
            ALTER TABLE "SiteSettings" 
            ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
            ALTER COLUMN "updatedAt" SET NOT NULL;
            
            -- If there are existing rows without updatedAt, update them
            UPDATE "SiteSettings" 
            SET "updatedAt" = CURRENT_TIMESTAMP 
            WHERE "updatedAt" IS NULL;
          ELSE
            -- Column doesn't exist, so add it
            ALTER TABLE "SiteSettings" 
            ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
          END IF;
        END $$;
        
        -- Fix other critical fields
        ALTER TABLE "SiteSettings" ALTER COLUMN "id" SET NOT NULL;
        
        -- Add default values for commonly used fields if they exist
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'siteTitle') THEN
            ALTER TABLE "SiteSettings" ALTER COLUMN "siteTitle" SET DEFAULT 'MCMS';
          END IF;
          
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'SiteSettings' AND column_name = 'siteDescription') THEN
            ALTER TABLE "SiteSettings" ALTER COLUMN "siteDescription" SET DEFAULT 'Modern Content Management System';
          END IF;
        END $$;
      `);
      
      console.log('SiteSettings table structure fixed.');
    } catch (error) {
      console.error('Error fixing SiteSettings table:', error);
    }
    
    // Create a new migration to sync any remaining differences
    console.log('Creating a new migration to fix any remaining discrepancies...');
    try {
      await runCommand('npx prisma migrate dev --name fix_schema_sync --create-only');
      await runCommand('npx prisma migrate deploy');
    } catch (migrationError) {
      console.error('Migration failed:', migrationError);
      console.log('Schema may have discrepancies. Using SQL to ensure critical tables exist...');
      await fixSchemaDirect(prisma);
    }
    
    // Regenerate the Prisma client
    console.log('Regenerating Prisma client...');
    await runCommand('npx prisma generate');
    
    console.log('Schema fix complete!');
    
    // Clean up temporary schema file
    if (fs.existsSync('./prisma/temp-schema.prisma')) {
      fs.unlinkSync('./prisma/temp-schema.prisma');
    }
    
  } catch (error) {
    console.error('Error fixing schema:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Add missing columns to existing tables using SQL
async function addMissingColumns(prisma) {
  try {
    console.log('Checking for missing columns in critical tables...');
    
    // Check for SiteSettings.siteTitle column
    try {
      await prisma.$executeRawUnsafe(`SELECT "siteTitle" FROM "SiteSettings" LIMIT 1`);
      console.log('SiteSettings.siteTitle column exists.');
    } catch (error) {
      console.log('Adding missing SiteSettings.siteTitle column...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "SiteSettings" 
        ADD COLUMN IF NOT EXISTS "siteTitle" TEXT NOT NULL DEFAULT 'MCMS'
      `);
    }
    
    // Check for ModuleConfig.settings column
    try {
      await prisma.$executeRawUnsafe(`SELECT "settings" FROM "ModuleConfig" LIMIT 1`);
      console.log('ModuleConfig.settings column exists.');
    } catch (error) {
      console.log('Adding missing ModuleConfig.settings column...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "ModuleConfig" 
        ADD COLUMN IF NOT EXISTS "settings" JSONB DEFAULT '{}'
      `);
    }
    
    console.log('Missing column checks complete.');
  } catch (error) {
    console.error('Error fixing columns:', error);
    throw error;
  }
}

// Fix schema directly using SQL when migrations fail
async function fixSchemaDirect(prisma) {
  try {
    console.log('Ensuring critical tables exist using direct SQL...');
    
    // Create ModuleConfig table if it doesn't exist
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
      
      -- Add unique constraint to slug if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'ModuleConfig_slug_key' AND conrelid = 'ModuleConfig'::regclass
        ) THEN
          ALTER TABLE "ModuleConfig" ADD CONSTRAINT "ModuleConfig_slug_key" UNIQUE ("slug");
        END IF;
      EXCEPTION
        WHEN undefined_table THEN
          -- Table doesn't exist, constraint will be added when table is created
      END $$;
    `);
    
    // Create SiteSettings table if it doesn't exist
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
    
    console.log('Critical tables created/fixed successfully.');
  } catch (error) {
    console.error('Error in direct SQL schema fix:', error);
    throw error;
  }
}

async function fixSchema() {
  console.log('Starting schema fix process...');
  
  try {
    // Create enums if needed
    await createEnums();
    
    // Create or fix tables
    await createTables();
    
    // Add missing columns to existing tables
    await addMissingColumns();
    
    console.log('Schema fix completed successfully');
  } catch (error) {
    console.error('Error fixing schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function createEnums() {
  console.log('Ensuring enum types exist...');
  
  try {
    // This will execute the schema-init.sql via direct SQL
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        -- Create Role enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
          CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER', 'EDITOR', 'STUDENT');
        END IF;
        
        -- Create SchoolRole enum if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'schoolrole') THEN
          CREATE TYPE "public"."SchoolRole" AS ENUM ('TEACHER', 'STUDENT', 'STAFF');
        END IF;
        
        -- Create other enums from your schema
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'navigation_item_type') THEN
          CREATE TYPE "navigation_item_type" AS ENUM ('LINK', 'DROPDOWN', 'HEADING', 'DIVIDER');
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
          CREATE TYPE "user_role_enum" AS ENUM ('ADMIN', 'EDITOR', 'MODERATOR', 'USER', 'GUEST');
        END IF;
      END
      $$;
    `);
    
    console.log('Enum types created or verified successfully');
  } catch (error) {
    console.error('Error creating enum types:', error);
    throw error;
  }
}

async function createTables() {
  console.log('Creating or verifying essential tables...');
  
  try {
    // Create SiteSettings table if it doesn't exist
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
    
    // Create ModuleConfig table if needed
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
        CONSTRAINT "ModuleConfig_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "ModuleConfig_slug_key" UNIQUE ("slug")
      );
    `);
    
    console.log('Essential tables created or verified successfully');
  } catch (error) {
    console.error('Error creating essential tables:', error);
    throw error;
  }
}

async function addMissingColumns() {
  console.log('Checking for missing columns in critical tables...');
  
  try {
    // Check for SiteSettings columns
    const siteSettingsColumns = [
      { name: "siteTitle", type: "TEXT NOT NULL DEFAULT 'MCMS'" },
      { name: "siteDescription", type: "TEXT NOT NULL DEFAULT 'Modern Content Management System'" },
      { name: "logo", type: "TEXT" },
      { name: "accentColor", type: "TEXT" },
      { name: "enableUserRegistration", type: "BOOLEAN NOT NULL DEFAULT true" },
      { name: "requireEmailVerification", type: "BOOLEAN NOT NULL DEFAULT false" },
      { name: "requireAccountApproval", type: "BOOLEAN NOT NULL DEFAULT false" },
      { name: "fileStorageProvider", type: "TEXT NOT NULL DEFAULT 'local'" },
      { name: "maxFileSize", type: "INTEGER NOT NULL DEFAULT 10" },
      { name: "allowedFileTypes", type: "TEXT[] DEFAULT ARRAY['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx']" },
      { name: "emailProvider", type: "TEXT" },
      { name: "smtpHost", type: "TEXT" },
      { name: "smtpPort", type: "INTEGER" },
      { name: "smtpSecure", type: "BOOLEAN NOT NULL DEFAULT false" },
      { name: "smtpAuthUser", type: "TEXT" },
      { name: "smtpAuthPass", type: "TEXT" },
      { name: "sesRegion", type: "TEXT" },
      { name: "sesAccessKey", type: "TEXT" },
      { name: "sesSecretAccessKey", type: "TEXT" },
      { name: "emailFrom", type: "TEXT" },
      { name: "footerText", type: "TEXT" },
      { name: "copyrightText", type: "TEXT" }
    ];
    
    for (const column of siteSettingsColumns) {
      try {
        // Check if column exists
        await prisma.$executeRawUnsafe(`SELECT "${column.name}" FROM "SiteSettings" LIMIT 1`);
        console.log(`SiteSettings.${column.name} column exists.`);
      } catch (error) {
        // Column doesn't exist, add it
        console.log(`Adding missing SiteSettings.${column.name} column...`);
        await prisma.$executeRawUnsafe(`
          ALTER TABLE "SiteSettings" 
          ADD COLUMN IF NOT EXISTS "${column.name}" ${column.type}
        `);
      }
    }
    
    // Check for ModuleConfig.settings column
    try {
      await prisma.$executeRawUnsafe(`SELECT "settings" FROM "ModuleConfig" LIMIT 1`);
      console.log('ModuleConfig.settings column exists.');
    } catch (error) {
      console.log('Adding missing ModuleConfig.settings column...');
      await prisma.$executeRawUnsafe(`
        ALTER TABLE "ModuleConfig" 
        ADD COLUMN IF NOT EXISTS "settings" JSONB DEFAULT '{}'
      `);
    }
    
    console.log('Missing column checks complete.');
  } catch (error) {
    console.error('Error fixing columns:', error);
    throw error;
  }
}

// Run the fix
fixSchema();
