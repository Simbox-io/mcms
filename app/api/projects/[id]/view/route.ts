// app/api/projects/[id]/view/route.ts
import { NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  try {
    const project = await cachedPrisma.project.update({
      where: { id: projectId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project views:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}