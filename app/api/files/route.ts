import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LocalStorageProvider, S3StorageProvider, FTPStorageProvider } from '@/lib/file-storage';
import { getSession } from '@/lib/auth';
import { FileStorageProvider } from '@/lib/file-storage';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalFiles = await prisma.file.count();
    const totalPages = Math.ceil(totalFiles / perPage);

    const files = await prisma.file.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ files, totalPages });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const description = formData.get('description') as string;
  const isPublic = formData.get('isPublic') === 'true';
  const projectId = Number(formData.get('projectId'));

  try {
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

    const fileUrl = await storageProvider.uploadFile(file);

    const newFile = await prisma.file.create({
      data: {
        name: file.name,
        url: fileUrl,
        description,
        isPublic,
        project: projectId ? { connect: { id: projectId } } : undefined,
        uploadedBy: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}