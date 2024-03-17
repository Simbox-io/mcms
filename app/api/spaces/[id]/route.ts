// app/api/spaces/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const spaceId = params.id;

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        pages: true,
        project: true,
        views: true,
        bookmarks: true,
        settings: {
          include: {
            accessControlSettings: true,
            collaborationSettings: true,
            versionControlSettings: true,
            exportSettings: true,
            backupSettings: true,
          },
        },
      },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    return NextResponse.json(space);
  } catch (error) {
    console.error('Error fetching space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;
  const { name, description, projectId, collaborators, settings } = await request.json();

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { owner: true },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.owner.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedSpace = await prisma.space.update({
      where: { id: spaceId },
      data: {
        name,
        description,
        project: projectId ? { connect: { id: projectId } } : undefined,
        collaborators: {
          set: collaborators.map((collaboratorId: string) => ({ id: collaboratorId })),
        },
        settings: settings
          ? {
              update: {
                accessControlSettings: settings.accessControlSettings
                  ? {
                      update: {
                        visibility: settings.accessControlSettings.visibility,
                        password: settings.accessControlSettings.password,
                      },
                    }
                  : undefined,
                collaborationSettings: settings.collaborationSettings
                  ? {
                      update: {
                        allowCollaborators: settings.collaborationSettings.allowCollaborators,
                        collaboratorRoles: settings.collaborationSettings.collaboratorRoles,
                      },
                    }
                  : undefined,
                versionControlSettings: settings.versionControlSettings
                  ? {
                      update: {
                        enableVersioning: settings.versionControlSettings.enableVersioning,
                        versionNamingConvention: settings.versionControlSettings.versionNamingConvention,
                      },
                    }
                  : undefined,
                exportSettings: settings.exportSettings
                  ? {
                      update: {
                        allowExport: settings.exportSettings.allowExport,
                        exportFormats: settings.exportSettings.exportFormats,
                      },
                    }
                  : undefined,
                backupSettings: settings.backupSettings
                  ? {
                      update: {
                        enableAutoBackup: settings.backupSettings.enableAutoBackup,
                        backupFrequency: settings.backupSettings.backupFrequency,
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        pages: true,
        project: true,
        views: true,
        bookmarks: true,
        settings: {
          include: {
            accessControlSettings: true,
            collaborationSettings: true,
            versionControlSettings: true,
            exportSettings: true,
            backupSettings: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSpace);
  } catch (error) {
    console.error('Error updating space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: { owner: true },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.owner.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.space.delete({
      where: { id: spaceId },
    });

    return NextResponse.json({ message: 'Space deleted successfully' });
  } catch (error) {
    console.error('Error deleting space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}