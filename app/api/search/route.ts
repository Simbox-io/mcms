// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const [posts, files, projects, spaces, tutorials] = await Promise.all([
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
          content: true,
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          tags: true,
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
          description: true,
          uploadedBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          tags: true,
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
          description: true,
          owner: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          tags: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.space.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          owner: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.tutorial.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          tags: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

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
    }) + await prisma.space.count({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
    }) + await prisma.tutorial.count({
      where: {
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      },
    });

    const totalPages = Math.ceil(totalResults / perPage);

    return NextResponse.json({
      posts,
      files,
      projects,
      spaces,
      tutorials,
      totalResults,
      totalPages,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}