// app/api/spaces/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;
  const search = searchParams.get('search') || '';

  try {
    const totalSpaces = await prisma.space.count({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
    });
    const totalPages = Math.ceil(totalSpaces / perPage);

    const spaces = await prisma.space.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        owner: true,
        collaborators: true,
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
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ spaces, totalPages });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, projectId, collaborators, settings } = await request.json();

  try {
    const newSpace = await prisma.space.create({
      data: {
        name,
        description,
        owner: { connect: { id: user.id } },
        project: projectId ? { connect: { id: projectId } } : undefined,
        collaborators: {
          connect: collaborators.map((collaboratorId: string) => ({ id: collaboratorId })),
        },
        settings: settings
          ? {
              create: {
                accessControlSettings: settings.accessControlSettings
                  ? {
                      create: {
                        visibility: settings.accessControlSettings.visibility,
                        password: settings.accessControlSettings.password,
                      },
                    }
                  : undefined,
                collaborationSettings: settings.collaborationSettings
                  ? {
                      create: {
                        allowCollaborators: settings.collaborationSettings.allowCollaborators,
                        collaboratorRoles: settings.collaborationSettings.collaboratorRoles,
                      },
                    }
                  : undefined,
                versionControlSettings: settings.versionControlSettings
                  ? {
                      create: {
                        enableVersioning: settings.versionControlSettings.enableVersioning,
                        versionNamingConvention: settings.versionControlSettings.versionNamingConvention,
                      },
                    }
                  : undefined,
                exportSettings: settings.exportSettings
                  ? {
                      create: {
                        allowExport: settings.exportSettings.allowExport,
                        exportFormats: settings.exportSettings.exportFormats,
                      },
                    }
                  : undefined,
                backupSettings: settings.backupSettings
                  ? {
                      create: {
                        enableAutoBackup: settings.backupSettings.enableAutoBackup,
                        backupFrequency: settings.backupSettings.backupFrequency,
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(newSpace, { status: 201 });
  } catch (error) {
    console.error('Error creating space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}