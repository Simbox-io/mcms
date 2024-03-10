// app/api/projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

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
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
          },
        },
        members: {
          select: {
            id: true,
            username: true,
          },
        },
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

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, repository, members } = await request.json();

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        repository,
        members: {
          connect: members.map((memberId: number) => ({ id: memberId })),
        },
        owner: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}