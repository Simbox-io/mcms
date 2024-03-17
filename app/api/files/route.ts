// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User, AdminSettings } from '@/lib/prisma';
import { getStorageProvider } from '@/lib/file-storage';

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
      orderBy: {
        createdAt: 'desc',
      },
    });
    const adminSettings = await prisma.adminSettings.findFirst();
    const storageProvider = await getStorageProvider(adminSettings! as AdminSettings);
    const filesWithUrls = files.map((file) => ({
      ...file,
      url: storageProvider.getFileUrl(file.url),
    }));
    return NextResponse.json({ files: filesWithUrls, totalPages });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll('file') as File[];
  const { name, description, isPublic, projectId, parentId, tags } = Object.fromEntries(formData.entries());

  try {
    const adminSettings = await prisma.adminSettings.findFirst();
    if (!adminSettings) {
      return NextResponse.json({ message: 'Admin settings not found' }, { status: 500 });
    }

    const storageProvider = await getStorageProvider(adminSettings as AdminSettings);

    const uploadedFiles = [];

    for (const file of files) {
      const fileUrl = await storageProvider.uploadFile(file);
      const newFile = await prisma.file.create({

        data: {
          name: name as string,
          url: fileUrl,
          description: description as string,
          isPublic: isPublic === 'true',
          project: projectId ? { connect: { id: projectId as string } } : undefined,
          uploadedBy: { connect: { id: userObj.id } },
          parent: parentId ? { connect: { id: parentId as string } } : undefined,
          tags: tags
            ? {
              connectOrCreate: (tags as string).split(',').map((tag) => ({
                where: { name: tag.trim() },
                create: { name: tag.trim() },
              })),
            }
            : undefined,
          settings: {
            create: {
              uploadLimits: {
                create: {
                  maxFileSize: adminSettings.maxFileSize,
                  allowedFileTypes: adminSettings.allowedFileTypes,
                },
              },
              downloadSettings: {
                create: {
                  requireLogin: adminSettings.requireLoginToDownload,
                },
              },
              expirationSettings: {
                create: {
                  autoDelete: adminSettings.autoDeleteFiles,
                  expirationPeriod: adminSettings.fileExpirationPeriod,
                },
              },
              versioningSettings: {
                create: {
                  keepVersions: adminSettings.enableVersioning,
                },
              },
            },
          },
        },
      });
      uploadedFiles.push(newFile);
    }

      return NextResponse.json(uploadedFiles, { status: 201 });
    } catch (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }