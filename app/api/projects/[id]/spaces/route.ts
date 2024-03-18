// app/api/projects/[id]/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;

  try {
    const files = await prisma.file.findMany({
      where: { projectId },
      include: {
        uploadedBy: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
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

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching project files:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const projectId = params.id;
  const { name, description, isPublic, parentId, tags, settings, contentType } = await request.json();

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { collaborators: true },
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.ownerId !== userObj.id && !project.collaborators.some((collaborator) => collaborator.id === userObj.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const newFile = await prisma.file.create({
      data: {
        name,
        description,
        url: '',
        isPublic,
        contentType,
        project: { connect: { id: projectId } },
        uploadedBy: { connect: { id: userObj.id } },
        parent: parentId ? { connect: { id: parentId } } : undefined,
        tags: tags
          ? {
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
        settings: settings
          ? {
              create: {
                uploadLimits: {
                  create: {
                    maxFileSize: settings.maxFileSize,
                    allowedFileTypes: settings.allowedFileTypes,
                  },
                },
                downloadSettings: {
                  create: {
                    requireLogin: settings.requireLogin,
                    allowPublicDownload: settings.allowPublicDownload,
                  },
                },
                expirationSettings: {
                  create: {
                    autoDelete: settings.autoDelete,
                    expirationPeriod: settings.expirationPeriod,
                  },
                },
                versioningSettings: {
                  create: {
                    keepVersions: settings.keepVersions,
                  },
                },
                metadataSettings: {
                  create: {
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

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    console.error('Error creating project file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}