/**
 * Seed function for creating default navigation menus
 */

async function seedNavigation(prisma: any) {
  console.log('🧭 Creating default navigation menus...');

  // Create header navigation menu
  const headerMenu = await prisma.navigationMenu.upsert({
    where: { name: 'Main Header Menu' },
    update: {},
    create: {
      name: 'Main Header Menu',
      description: 'Main navigation menu shown in the site header',
      location: 'header',
    },
  });

  // Create default navigation items
  const defaultHeaderItems = [
    {
      title: 'Home',
      url: '/',
      icon: '🏠',
      order: 0,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: headerMenu.id,
    },
    {
      title: 'Projects',
      url: '/projects',
      icon: '📂',
      order: 1,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: headerMenu.id,
    },
    {
      title: 'Forums',
      url: '/forums',
      icon: '💬',
      order: 2,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: headerMenu.id,
    },
    {
      title: 'Blog',
      url: '/blog',
      icon: '📝',
      order: 3,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: headerMenu.id,
    },
    {
      title: 'About',
      url: '/about',
      icon: '❓',
      order: 4,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: headerMenu.id,
    },
    {
      title: 'Contact',
      url: '/contact',
      icon: '📧',
      order: 5,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: headerMenu.id,
    },
  ];

  // Create all header navigation items
  console.log('📌 Creating default header navigation items...');
  
  for (const item of defaultHeaderItems) {
    await prisma.navigationItem.upsert({
      where: { 
        id: `header-${item.title.toLowerCase()}` 
      },
      update: item,
      create: {
        id: `header-${item.title.toLowerCase()}`,
        ...item,
      },
    });
  }

  // Create footer navigation menu
  const footerMenu = await prisma.navigationMenu.upsert({
    where: { name: 'Footer Menu' },
    update: {},
    create: {
      name: 'Footer Menu',
      description: 'Navigation menu shown in the site footer',
      location: 'footer',
    },
  });

  // Create default footer navigation items
  const defaultFooterItems = [
    {
      title: 'Privacy Policy',
      url: '/privacy-policy',
      order: 0,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: footerMenu.id,
    },
    {
      title: 'Terms of Service',
      url: '/terms-of-service',
      order: 1,
      openInNewTab: false,
      requiresAuth: false,
      isEnabled: true,
      menuId: footerMenu.id,
    },
    {
      title: 'GitHub',
      url: 'https://github.com/Simbox-io/mcms',
      icon: '💻',
      order: 2,
      openInNewTab: true,
      requiresAuth: false,
      isEnabled: true,
      menuId: footerMenu.id,
    },
  ];

  // Create all footer navigation items
  console.log('📌 Creating default footer navigation items...');
  
  for (const item of defaultFooterItems) {
    await prisma.navigationItem.upsert({
      where: { 
        id: `footer-${item.title.toLowerCase().replace(/ /g, '-')}` 
      },
      update: item,
      create: {
        id: `footer-${item.title.toLowerCase().replace(/ /g, '-')}`,
        ...item,
      },
    });
  }

  console.log('✅ Navigation menus seeded successfully!');
}

module.exports = { seedNavigation };
