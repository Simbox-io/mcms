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
          passwordHash: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
          studentRole: 'ADMIN',
          points: 0,
        },
      });
      console.log('Test user created successfully:', testUser.email);
    } catch (err) {
      console.error('Error creating user:', err);
      // Continue with seeding other data even if user creation fails
    }

    // Now seed some basic CMS modules
    console.log('Creating default CMS modules...');
    
    const defaultModules = [
      {
        name: 'Pages',
        slug: 'pages',
        description: 'Create and manage site pages',
        isEnabled: true,
        icon: '📄',
        adminRoute: '/admin/pages',
        displayOrder: 1,
        settings: {},
      },
      {
        name: 'Media',
        slug: 'media',
        description: 'Manage media files and uploads',
        isEnabled: true,
        icon: '🖼️',
        adminRoute: '/admin/media',
        displayOrder: 2,
        settings: {},
      },
      {
        name: 'Users',
        slug: 'users',
        description: 'User management and permissions',
        isEnabled: true,
        icon: '👥',
        adminRoute: '/admin/users',
        displayOrder: 3,
        settings: {},
      },
    ];
    
    for (const module of defaultModules) {
      try {
        await prisma.moduleConfig.upsert({
          where: { slug: module.slug },
          update: module,
          create: module,
        });
      } catch (err) {
        console.error('Error creating module:', err);
      }
    }
    
    console.log(`Created ${defaultModules.length} default modules`);

    // Add default site settings
    try {
      const defaultSettings = {
        siteTitle: 'MCMS',
        siteDescription: 'Modern Content Management System',
        enableUserRegistration: true,
        requireEmailVerification: false,
        requireAccountApproval: false,
        fileStorageProvider: 'local',
        maxFileSize: 10,
        allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx'],
        emailProvider: 'smtp',
        footerText: ' 2025 MCMS',
        copyrightText: 'All rights reserved',
      };

      await prisma.siteSettings.upsert({
        where: { id: '0' },
        update: defaultSettings,
        create: {
          ...defaultSettings,
          id: '0',
        },
      });
      console.log('Default site settings created successfully');
    } catch (err) {
      console.error('Error creating site settings:', err);
    }
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
