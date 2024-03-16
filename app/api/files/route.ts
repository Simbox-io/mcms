// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';
import { uploadFile } from '@/lib/file-storage';

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

    return NextResponse.json({ files, totalPages });
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
  const file = formData.get('file') as File;
  const { name, description, isPublic, projectId, parentId, tags, settings } = Object.fromEntries(formData.entries());

  try {
    const fileUrl = await uploadFile(file);

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
        settings: settings
          ? {
            create: {
              uploadLimits: {
                create: {
                  maxFileSize: parseInt(settings.maxFileSize as string),
                  allowedFileTypes: (settings.allowedFileTypes as string).split(',').map((type) => type.trim()),
                },
              },
              downloadSettings: {
                create: {
                  requireLogin: settings.requireLogin === 'true',
                  allowPublicDownload: settings.allowPublicDownload === 'true',
                },
              },
              expirationSettings: {
                create: {
                  autoDelete: settings.autoDelete === 'true',
                  expirationPeriod: parseInt(settings.expirationPeriod as string),
                },
              },
              versioningSettings: {
                create: {
                  keepVersions: settings.keepVersions === 'true',
                },
              },
              metadataSettings: {
                create: {
                  allowCustomMetadata: settings.allowCustomMetadata === 'true',
                },
              },
            },
          }
          : undefined,
      },
    });

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}