import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;
  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const adminSettings = await prisma.adminSettings.findFirst();
  return NextResponse.json(adminSettings);
}

export async function PUT(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;
  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const {
    siteTitle,
    siteDescription,
    logo,
    accentColor,
    fileStorageProvider,
    s3AccessKey,
    s3SecretKey,
    s3BucketName,
    s3Region,
    ftpHost,
    ftpUser,
    ftpPassword,
    ftpDirectory,
    maxFileSize,
    allowedFileTypes,
    requireEmailVerification,
    requireAccountApproval,
    enableUserRegistration,
    requireLoginToDownload,
    autoDeleteFiles,
    fileExpirationPeriod,
    enableVersioning,
  } = await request.json();
  try {
    const updatedSettings = await prisma.adminSettings.upsert({
      where: { id: 1 },
      update: {
        siteTitle,
        siteDescription,
        logo,
        accentColor,
        fileStorageProvider,
        s3AccessKey,
        s3SecretKey,
        s3BucketName,
        s3Region,
        ftpHost,
        ftpUser,
        ftpPassword,
        ftpDirectory,
        maxFileSize,
        allowedFileTypes,
        requireEmailVerification,
        requireAccountApproval,
        enableUserRegistration,
        requireLoginToDownload,
        autoDeleteFiles,
        fileExpirationPeriod,
        enableVersioning,
      },
      create: {
        siteTitle,
        siteDescription,
        logo,
        accentColor,
        fileStorageProvider,
        s3AccessKey,
        s3SecretKey,
        s3BucketName,
        s3Region,
        ftpHost,
        ftpUser,
        ftpPassword,
        ftpDirectory,
        maxFileSize,
        allowedFileTypes,
        requireEmailVerification,
        requireAccountApproval,
        enableUserRegistration,
        requireLoginToDownload,
        autoDeleteFiles,
        fileExpirationPeriod,
        enableVersioning,
      },
    });
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;
  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await prisma.adminSettings.delete({
      where: { id: 1 },
    });
    return NextResponse.json({ message: 'Admin settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}