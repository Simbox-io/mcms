// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, collaborators, tags, settings } = await request.json();

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { owner: true },
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.owner.id !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        collaborators: {
          set: collaborators.map((collaboratorId: string) => ({ id: collaboratorId })),
        },
        tags: {
          set: tags.map((tag: string) => ({ name: tag })),
        },
        settings: settings
          ? {
              update: {
                visibilitySettings: settings.visibilitySettings
                  ? {
                      update: {
                        visibility: settings.visibilitySettings.visibility,
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
                notificationSettings: settings.notificationSettings
                  ? {
                      update: {
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

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { owner: true },
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.owner.id !== user.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}