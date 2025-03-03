// @ts-check
const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔍 Running pre-seed checks...');
  const prisma = new PrismaClient();

  try {
    // First, ensure the database has the latest schema structure
    try {
      console.log('📊 Running migration to ensure database structure...');
      
      // Generate the client first
      execSync('npx prisma generate', {
        stdio: 'inherit'
      });
      
      // Try to apply migrations - this might fail if the database is in an inconsistent state
      try {
        execSync('npx prisma migrate deploy', {
          stdio: 'inherit'
        });
        console.log('✅ Database migrations applied successfully');
      } catch (migrateError) {
        console.warn('⚠️ Migration failed, trying to reset...');
        
        // Force reset as a last resort - this will wipe the database, but at least it will be in a consistent state
        try {
          execSync('npx prisma migrate reset --force', {
            stdio: 'inherit'
          });
          console.log('✅ Database reset successfully');
        } catch (resetError) {
          console.error('❌ Database reset failed:', resetError);
          console.log('📝 Trying direct SQL approach...');
          await createTablesDirectly(prisma);
        }
      }
    } catch (error) {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Pre-seed check failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Create tables directly using SQL
 * @param {PrismaClient} prisma
 */
async function createTablesDirectly(prisma) {
  try {
    // Drop tables if they exist to avoid inconsistencies
    await prisma.$executeRawUnsafe(`
      DROP TABLE IF EXISTS "SiteSettings" CASCADE;
      DROP TABLE IF EXISTS "ModuleConfig" CASCADE;
    `);
    
    // Create ModuleConfig table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ModuleConfig" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
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

    // Create SiteSettings table matching the Prisma schema
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SiteSettings" (
        "id" TEXT NOT NULL,
        "siteTitle" TEXT NOT NULL DEFAULT 'MCMS',
        "siteDescription" TEXT DEFAULT 'Modern Content Management System',
        "logo" TEXT,
        "accentColor" TEXT,
        "enableUserRegistration" BOOLEAN NOT NULL DEFAULT true,
        "requireEmailVerification" BOOLEAN NOT NULL DEFAULT false,
        "requireAccountApproval" BOOLEAN NOT NULL DEFAULT false,
        "fileStorageProvider" TEXT DEFAULT 'local',
        "maxFileSize" INTEGER DEFAULT 10,
        "allowedFileTypes" TEXT[] DEFAULT ARRAY['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx'],
        "emailProvider" TEXT,
        "smtpHost" TEXT,
        "smtpPort" INTEGER,
        "smtpSecure" BOOLEAN DEFAULT false,
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

    console.log('✅ Tables created directly using SQL');
    return true;
  } catch (error) {
    console.error('❌ Failed to create tables directly:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('✅ Pre-seed checks completed successfully.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Pre-seed checks failed:', e);
    process.exit(1);
  });
