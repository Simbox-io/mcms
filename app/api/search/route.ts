import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const [posts, files, projects] = await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        select: {
          id: true,
          title: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.file.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    const results = [
      ...posts.map((post) => ({ ...post, type: 'post' })),
      ...files.map((file) => ({ ...file, type: 'file' })),
      ...projects.map((project) => ({ ...project, type: 'project' })),
    ];

    const totalResults = await prisma.post.count({
      where: {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      },
    }) + await prisma.file.count({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
    }) + await prisma.project.count({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });

    const totalPages = Math.ceil(totalResults / perPage);

    return NextResponse.json({ results, totalPages });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}