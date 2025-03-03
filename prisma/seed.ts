// prisma/seed.ts
const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

// Import required seed functions
const { seedTestUser } = require('./seed-functions/seedUser');
const { seedCmsData } = require('./seed-functions/seedCms');
const { seedNavigation } = require('./seed-functions/seedNavigation');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed the database...');
  
  try {
    // Create seed test user
    console.log('🧑‍💼 Seeding test user...');
    await seedTestUser(prisma, bcryptjs);
    
    // Seed CMS data
    console.log('🧩 Seeding CMS modules...');
    await seedCmsData(prisma);
    
    // Seed navigation menus
    console.log('🧭 Seeding navigation menus...');
    await seedNavigation(prisma);
    
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in main seeding process:', e);
    process.exit(1);
  });
