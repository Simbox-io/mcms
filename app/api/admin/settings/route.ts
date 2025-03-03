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
  const session = await getSession(request);
  const user = session?.user as User;
  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  // Since we don't have an actual adminSettings model yet, we'll return default settings
  return NextResponse.json(DEFAULT_SETTINGS);
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;
  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get settings from request
    const settings = await request.json();
    
    // In a real implementation, we would save these settings to the database
    // For now, just return the settings that were sent
    return NextResponse.json({
      ...DEFAULT_SETTINGS,
      ...settings,
      updated: true
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;
  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ message: 'Settings reset to defaults' });
}