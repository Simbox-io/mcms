import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string, collaboratorId: string } }) {
    const session = await getSession(request);
    const userObj = session?.user as User;
  
    if (!userObj) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    const projectId = params.id;
    const { collaboratorId } = await request.json();
  
    try {
      const project = await cachedPrisma.project.findUnique({
        where: { id: projectId },
        include: { owner: true },
      });
  
      if (!project) {
        return NextResponse.json({ message: 'Project not found' }, { status: 404 });
      }
  
      if (project.ownerId !== userObj.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
  
      await cachedPrisma.project.update({
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