/**
 * Combined script to fix schema and seed the database
 * Run this script with Node.js to:
 * 1. Check and fix database schema issues
 * 2. Create necessary enum types
 * 3. Add missing columns to tables
 * 4. Seed the database with initial data
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔧 Starting database schema fix and seed process...');
    
    // First check if database is accessible
    try {
      console.log('Checking database connection...');
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connection successful.');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      console.log('Make sure your docker containers are running with: docker compose up');
      process.exit(1);
    }
    
    // Fix schema issues
    try {
      console.log('Fixing database schema issues...');
      
      // Create enum types if they don't exist
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          -- Create Role enum if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
            CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'EDITOR');
          END IF;
          
          -- Create SchoolRole enum if it doesn't exist
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'schoolrole') THEN
            CREATE TYPE "SchoolRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'NONE');
          END IF;
        END $$;
      `);
      
      // Create or update SiteSettings table
      await prisma.$executeRawUnsafe(`
        -- Make sure SiteSettings table has all required columns
        ALTER TABLE "SiteSettings" 
        ADD COLUMN IF NOT EXISTS "id" TEXT NOT NULL DEFAULT 'default',
        ADD COLUMN IF NOT EXISTS "siteTitle" TEXT DEFAULT 'MCMS',
        ADD COLUMN IF NOT EXISTS "siteDescription" TEXT DEFAULT 'Modern Content Management System',
        ADD COLUMN IF NOT EXISTS "logo" TEXT,
        ADD COLUMN IF NOT EXISTS "favicon" TEXT,
        ADD COLUMN IF NOT EXISTS "primaryColor" TEXT DEFAULT '#3b82f6',
        ADD COLUMN IF NOT EXISTS "accentColor" TEXT DEFAULT '#10b981',
        ADD COLUMN IF NOT EXISTS "enableUserRegistration" BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
        
        -- Ensure primary key constraint
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'SiteSettings_pkey'
          ) THEN
            ALTER TABLE "SiteSettings" ADD PRIMARY KEY ("id");
          END IF;
        END $$;
      `);
      
      console.log('✅ Database schema fixes applied.');
    } catch (error) {
      console.error('❌ Error fixing database schema:', error);
      throw error;
    }
    
    // Run migrations if necessary
    try {
      console.log('Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations completed.');
    } catch (error) {
      console.error('❌ Error running migrations:', error);
      throw error;
    }
    
    // Seed the database
    try {
      console.log('Seeding database...');
      execSync('node scripts/seed.cjs', { stdio: 'inherit' });
      console.log('✅ Database seeding completed.');
    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
    
    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
