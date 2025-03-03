// Simple seed script to create a test user
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

async function seedUser() {
  const prisma = new PrismaClient();
  console.log('Seeding test user...');
  
  try {
    // Create a default test user
    const hashedPassword = await bcryptjs.hash('password123', 10);
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        passwordHash: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN',
        settings: {
          create: {
            emailVerified: true,
            notificationPreferences: {
              create: {
                email: true,
                push: true,
                inApp: true,
              },
            },
            privacySettings: {
              create: {
                profileVisibility: 'PUBLIC',
                activityVisibility: 'PUBLIC',
              },
            },
          },
        },
        profile: {
          create: {},
        },
      },
    });

    console.log('Created test user:', testUser.email);
    console.log('Login with:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
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
      await prisma.module.upsert({
        where: { slug: module.slug },
        update: module,
        create: module,
      });
    }
    
    console.log(`Created ${defaultModules.length} default modules`);
    
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
await seedUser();
console.log('Seeding completed successfully');
