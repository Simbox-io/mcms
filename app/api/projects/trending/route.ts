// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalProjects = await cachedPrisma.project.count();
    const totalPages = Math.ceil(totalProjects / perPage);

    const projects = await cachedPrisma.project.findMany({
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
        views: 'desc',
      },
    });

    return NextResponse.json({ projects, totalPages });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
