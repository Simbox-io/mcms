// app/api/files/[id]/route.ts


import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { FileStorageProvider, LocalStorageProvider, S3StorageProvider, FTPStorageProvider } from '@/lib/file-storage';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = parseInt(params.id);

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = parseInt(params.id);

  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    const adminSettings = await prisma.adminSettings.findUnique({
      where: { id: 1 },
    });

    let storageProvider: FileStorageProvider;
    switch (adminSettings?.fileStorageProvider) {
      case 's3':
        storageProvider = new S3StorageProvider();
        break;
      case 'ftp':
        storageProvider = new FTPStorageProvider();
        break;
      default:
        storageProvider = new LocalStorageProvider();
    }

    await storageProvider.deleteFile(file.url);

    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}