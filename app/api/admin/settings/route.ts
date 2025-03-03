import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

// Default settings 
const DEFAULT_SETTINGS = {
  siteTitle: 'MCMS',
  siteDescription: 'Modern Content Management System',
  logo: '/logo.png',
  accentColor: '#3182CE',
  enableUserRegistration: true,
  requireEmailVerification: false,
  requireAccountApproval: false,
  fileStorageProvider: 'local',
  maxFileSize: 10, // in MB
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'xlsx'],
};

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    const user = session?.user as User;
    if (!session || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if we have settings in the database
    const siteSettings = await cachedPrisma.siteSettings.findFirst();
    
    if (siteSettings) {
      return NextResponse.json(siteSettings);
    }
    
    // If no settings exist, return default settings
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);
    const user = session?.user as User;
    if (!session || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Get settings from request
    const settings = await request.json();
    
    // Update or create settings in the database
    const updatedSettings = await cachedPrisma.siteSettings.upsert({
      where: { id: settings.id || '0' },
      update: {
        ...settings,
        updatedAt: new Date()
      },
      create: {
        ...settings,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    const user = session?.user as User;
    if (!session || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Delete all settings and reset to defaults
    await cachedPrisma.siteSettings.deleteMany({});
    
    return NextResponse.json({ message: 'Settings reset to defaults', settings: DEFAULT_SETTINGS });
  } catch (error) {
    console.error('Error deleting settings:', error);
    return NextResponse.json({ message: 'Error resetting settings' }, { status: 500 });
  }
}