// Simple seed script to create a test user
const bcryptjs = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedUser() {
  try {
    // Create a default test user
    console.log('Creating test user...');
    const hashedPassword = await bcryptjs.hash('password123', 10);

    try {
      const testUser = await prisma.user.upsert({
        where: {
          email: 'admin@example.com',
        },
        update: {},
        create: {
          email: 'admin@example.com',
          username: 'admin',
          password_hash: hashedPassword,
          first_name: 'Admin',
          last_name: 'User',
          email_verified: true,
          role: 'ADMIN',
        },
      });
      console.log('Test user created successfully:', testUser.email);
    } catch (err) {
      console.log('Error creating user:', err.message);
      // Continue with seeding other data even if user creation fails
    }

    // Now seed some basic CMS modules
    console.log('Creating default CMS modules...');
    
    const defaultModules = [
      {
        name: 'Pages',
        slug: 'pages',
        description: 'Create and manage site pages',
        is_enabled: true,
        icon: '📄',
        admin_route: '/admin/pages',
        display_order: 1,
        settings: {},
      },
      {
        name: 'Media',
        slug: 'media',
        description: 'Manage media files and uploads',
        is_enabled: true,
        icon: '🖼️',
        admin_route: '/admin/media',
        display_order: 2,
        settings: {},
      },
      {
        name: 'Users',
        slug: 'users',
        description: 'User management and permissions',
        is_enabled: true,
        icon: '👥',
        admin_route: '/admin/users',
        display_order: 3,
        settings: {},
      },
    ];
    
    for (const module of defaultModules) {
      try {
        await prisma.module.upsert({
          where: { slug: module.slug },
          update: module,
          create: module,
        });
      } catch (err) {
        console.log('Error creating module:', err.message);
      }
    }
    
    console.log(`Created ${defaultModules.length} default modules`);
  } catch (error) {
    console.error('Error in seeding process:', error);
  }
}

async function main() {
  try {
    console.log('Starting seeding...');
    await seedUser();
    console.log('Seeding completed');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
