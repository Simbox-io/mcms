const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');
const { fileURLToPath } = require('url');

async function seedTestUser(prisma, bcryptjs) {
  console.log('Seeding default test user...');
  
  // Hash the password using bcryptjs
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash('password123', salt);
  
  try {
    // Create a default test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        passwordHash: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'ADMIN', // Set as ADMIN to access all features
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

    console.log(`Created/updated test user: ${testUser.username} (${testUser.email})`);
    console.log('You can log in with:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    
    return testUser;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  }
}

// Export the function
exports.seedTestUser = seedTestUser;

// Allow direct execution for testing
// Check if this file is being run directly
if (require.main === module) {
  const prisma = new PrismaClient();
  
  seedTestUser(prisma, bcryptjs)
    .catch((error) => {
      console.error('Error seeding test user:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
