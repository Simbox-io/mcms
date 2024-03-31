// app/api/projects/[id]/collaborators/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';
import { forEach } from 'lodash';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = params.id;

  try {
    const collaborators = await prisma.user.findMany({
      where: {
        collaboratedProjects: {
          some: {
            id: projectId,
          },
        },
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error('Error fetching project collaborators:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const projectId = params.id;
  const collaborators = await request.json();
  const collaboratorIds = collaborators.members;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { owner: true },
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.ownerId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    forEach(collaboratorIds, async (collaborator: User) => {
      const res = await prisma.project.update({
        where: { id: projectId },
        data: {
          collaborators: {
            connect: { id: collaborator.id },
          },
        },
      });
    });

    return NextResponse.json({ message: 'Collaborator added successfully' });
  } catch (error) {
    console.error('Error adding project collaborator:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const projectId = params.id;
  const { collaboratorId } = await request.json();

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { owner: true },
    });

    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    if (project.ownerId !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        collaborators: {
          disconnect: { id: collaboratorId },
        },
      },
    });

    return NextResponse.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    console.error('Error removing project collaborator:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}