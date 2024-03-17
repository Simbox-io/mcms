// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalProjects = await prisma.project.count();
    const totalPages = Math.ceil(totalProjects / perPage);

    const projects = await prisma.project.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        owner: true,
        collaborators: true,
        files: true,
        tags: true,
        comments: true,
        spaces: true,
        bookmarks: true,
        settings: {
          include: {
            visibilitySettings: true,
            collaborationSettings: true,
            notificationSettings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ projects, totalPages });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, collaborators, tags, settings } = await request.json();

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        owner: { connect: { id: user.id } },
        collaborators: {
          connect: collaborators.map((collaboratorId: string) => ({ id: collaboratorId })),
        },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        settings: settings
          ? {
              create: {
                visibilitySettings: settings.visibilitySettings
                  ? {
                      create: {
                        visibility: settings.visibilitySettings.visibility,
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
                notificationSettings: settings.notificationSettings
                  ? {
                      create: {
                        notifyOnActivity: settings.notificationSettings.notifyOnActivity,
                        notifyOnMentions: settings.notificationSettings.notifyOnMentions,
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}