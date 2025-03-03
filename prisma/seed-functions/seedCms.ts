const { PrismaClient } = require('@prisma/client');

exports.seedCmsData = async function(prisma) {
  console.log('Seeding CMS management data...');
  
  // Create default modules
  const defaultModules = [
    {
      name: 'Forums',
      slug: 'forums',
      description: 'Forum management and configuration',
      isEnabled: true,
      icon: '💬',
      adminRoute: '/admin/forums',
      displayOrder: 1,
      settings: {
        allowAnonymousPosts: false,
        moderationRequired: true,
      },
    },
    {
      name: 'Pages',
      slug: 'pages',
      description: 'Create and manage site pages',
      isEnabled: true,
      icon: '📄',
      adminRoute: '/admin/pages',
      displayOrder: 2,
      settings: {},
    },
    {
      name: 'Media',
      slug: 'media',
      description: 'Manage media files and uploads',
      isEnabled: true,
      icon: '🖼️',
      adminRoute: '/admin/media',
      displayOrder: 3,
      settings: {
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        maxFileSize: 10485760, // 10MB
      },
    },
    {
      name: 'Users',
      slug: 'users',
      description: 'User management and permissions',
      isEnabled: true,
      icon: '👥',
      adminRoute: '/admin/users',
      displayOrder: 4,
      settings: {},
    },
    {
      name: 'Settings',
      slug: 'settings',
      description: 'Site configuration and settings',
      isEnabled: true,
      icon: '⚙️',
      adminRoute: '/admin/settings',
      displayOrder: 5,
      settings: {},
    },
    {
      name: 'Navigation',
      slug: 'navigation',
      description: 'Manage site navigation and menus',
      isEnabled: true,
      icon: '🧭',
      adminRoute: '/admin/navigation',
      displayOrder: 6,
      settings: {},
    },
  ];

  // Seed the modules
  for (const moduleData of defaultModules) {
    await prisma.module.upsert({
      where: { slug: moduleData.slug },
      update: moduleData,
      create: moduleData,
    });
  }

  console.log(`Created/updated ${defaultModules.length} default modules`);
  
  // Create default site settings
  const defaultSiteSettings = {
    siteName: 'My CMS Site',
    siteUrl: 'http://localhost:3000',
    siteDescription: 'A powerful and flexible CMS built with Next.js',
    siteLogo: '/images/logo.png',
    faviconUrl: '/favicon.ico',
    contactEmail: 'admin@example.com',
    footerText: ' 2025 My CMS Site. All rights reserved.',
    socialLinks: {
      twitter: 'https://twitter.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
    themeSettings: {
      primaryColor: '#3490dc',
      secondaryColor: '#ffed4a',
      darkMode: false,
      fontFamily: 'Inter, sans-serif',
    },
  };

  await prisma.siteSettings.upsert({
    where: { id: 1 }, // Assuming there's only one site settings entry
    update: defaultSiteSettings,
    create: {
      id: 1,
      ...defaultSiteSettings,
    },
  });

  console.log('Created/updated default site settings');
  
  // Create default navigation menus
  console.log('Creating default navigation menus...');
  await createDefaultNavigationMenus(prisma);
}

async function createDefaultNavigationMenus(prisma) {
  // Main header menu
  const headerMenu = await prisma.navigationMenu.upsert({
    where: { name_location: { name: 'Main Menu', location: 'header' } },
    update: {},
    create: {
      name: 'Main Menu',
      description: 'Primary navigation for the site header',
      location: 'header',
    }
  });

  console.log('Created header navigation menu');
  
  // Footer menu
  const footerMenu = await prisma.navigationMenu.upsert({
    where: { name_location: { name: 'Footer Menu', location: 'footer' } },
    update: {},
    create: {
      name: 'Footer Menu',
      description: 'Links for the site footer',
      location: 'footer',
    }
  });
  
  console.log('Created footer navigation menu');
  
  // Create default menu items for header
  const headerItems = [
    {
      title: 'Home',
      url: '/',
      order: 1,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
    {
      title: 'Blog',
      url: '/blog',
      order: 2,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
    {
      title: 'Forum',
      url: '/forum',
      order: 3,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
    {
      title: 'About',
      url: '/about',
      order: 4,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
    {
      title: 'Contact',
      url: '/contact',
      order: 5,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
    {
      title: 'Admin',
      url: '/admin',
      order: 6,
      openInNewTab: false,
      requiresAuth: true,
      requiredRole: 'ADMIN',
      isEnabled: true,
    },
  ];
  
  // Create default menu items for footer
  const footerItems = [
    {
      title: 'Privacy Policy',
      url: '/privacy',
      order: 1,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
    {
      title: 'Terms of Service',
      url: '/terms',
      order: 2,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
    {
      title: 'Contact Us',
      url: '/contact',
      order: 3,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
    },
  ];
  
  // Add items to header menu
  for (const item of headerItems) {
    await prisma.navigationItem.upsert({
      where: {
        menuId_title: {
          menuId: headerMenu.id,
          title: item.title,
        },
      },
      update: item,
      create: {
        ...item,
        menuId: headerMenu.id,
      },
    });
  }
  
  // Add items to footer menu
  for (const item of footerItems) {
    await prisma.navigationItem.upsert({
      where: {
        menuId_title: {
          menuId: footerMenu.id,
          title: item.title,
        },
      },
      update: item,
      create: {
        ...item,
        menuId: footerMenu.id,
      },
    });
  }
  
  console.log(`Added ${headerItems.length} items to header menu and ${footerItems.length} items to footer menu`);
}

// Allow direct execution for testing
// Check if this file is being run directly
const path = require('path');
const { fileURLToPath } = require('url');
if (require.main === module) {
  const prisma = new PrismaClient();
  
  exports.seedCmsData(prisma)
    .catch((error) => {
      console.error('Error seeding CMS data:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
