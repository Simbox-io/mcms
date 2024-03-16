// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User, AdminSettings } from '@/lib/prisma';
import { FileStorageProvider, LocalStorageProvider, S3StorageProvider, FTPStorageProvider } from '@/lib/file-storage';

async function getStorageProvider(adminSettings: AdminSettings | null): Promise<FileStorageProvider> {
  switch (adminSettings?.fileStorageProvider) {
    case 's3':
      return new S3StorageProvider();
    case 'ftp':
      return new FTPStorageProvider();
    default:
      return new LocalStorageProvider();
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
  const fileId = params.id.toString();

  try {
    const [file, adminSettings] = await Promise.all([
      prisma.file.findUnique({
        where: {
          id: fileId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          project: true,
          tags: true,
          comments: true,
          parent: true,
          children: true,
          reactions: true,
          bookmarks: true,
          settings: {
            include: {
              uploadLimits: true,
              downloadSettings: true,
              expirationSettings: true,
              versioningSettings: true,
              metadataSettings: true,
            },
          },
        },
      }),
      prisma.adminSettings.findFirst(),
    ]);

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    const storageProvider = await getStorageProvider(adminSettings);
    const fileUrl = storageProvider.getFileUrl(file.url);

    return NextResponse.json({ ...file, url: fileUrl });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id;
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, isPublic, projectId, parentId, tags, settings } = await request.json();

  try {
    const [file, adminSettings] = await Promise.all([
      prisma.file.findUnique({
        where: { id: fileId },
        include: { uploadedBy: true },
      }),
      prisma.adminSettings.findFirst(),
    ]);

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    if (file.uploadedBy.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        name,
        description,
        isPublic,
        project: projectId ? { connect: { id: projectId } } : undefined,
        parent: parentId ? { connect: { id: parentId } } : undefined,
        tags: tags
          ? {
              set: tags.map((tag: string) => ({ name: tag })),
            }
          : undefined,
        settings: settings
          ? {
              update: {
                uploadLimits: {
                  update: {
                    maxFileSize: settings.maxFileSize,
                    allowedFileTypes: settings.allowedFileTypes,
                  },
                },
                downloadSettings: {
                  update: {
                    requireLogin: settings.requireLogin,
                    allowPublicDownload: settings.allowPublicDownload,
                  },
                },
                expirationSettings: {
                  update: {
                    autoDelete: settings.autoDelete,
                    expirationPeriod: settings.expirationPeriod,
                  },
                },
                versioningSettings: {
                  update: {
                    keepVersions: settings.keepVersions,
                  },
                },
                metadataSettings: {
                  update: {
                    allowCustomMetadata: settings.allowCustomMetadata,
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        project: true,
        tags: true,
        comments: true,
        parent: true,
        children: true,
        reactions: true,
        bookmarks: true,
        settings: {
          include: {
            uploadLimits: true,
            downloadSettings: true,
            expirationSettings: true,
            versioningSettings: true,
            metadataSettings: true,
          },
        },
      },
    });

    const storageProvider = await getStorageProvider(adminSettings);
    const fileUrl = storageProvider.getFileUrl(updatedFile.url);

    return NextResponse.json({ ...updatedFile, url: fileUrl });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id;
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [file, adminSettings] = await Promise.all([
      prisma.file.findUnique({
        where: { id: fileId },
        include: { uploadedBy: true },
      }),
      prisma.adminSettings.findFirst(),
    ]);

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    if (file.uploadedBy.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const storageProvider = await getStorageProvider(adminSettings);
    await storageProvider.deleteFile(file.url);

    await prisma.file.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}