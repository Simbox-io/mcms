// app/api/users/[id]/projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '../../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}