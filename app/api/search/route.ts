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
  const perPage = 20;

  try {
    const [posts, files, projects, spaces, tutorials, users] = await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { author: { username: { contains: query, mode: 'insensitive' } } },
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
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { uploadedBy: { username: { contains: query, mode: 'insensitive' } } },
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
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { owner: { username: { contains: query, mode: 'insensitive' } } },
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
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { owner: { username: { contains: query, mode: 'insensitive' } } },
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
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { author: { username: { contains: query, mode: 'insensitive' } } },
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
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    const results = {
      posts: posts.map((post) => ({
        id: post.id,
        type: 'post',
        title: post.title,
        content: post.content || '',
        url: `/explore/posts/${post.id}`,
      })),
      files: files.map((file) => ({
        id: file.id,
        type: 'file',
        title: file.name,
        content: file.description || '',
        url: `/files/${file.id}`,
      })),
      projects: projects.map((project) => ({
        id: project.id,
        type: 'project',
        title: project.name,
        content: project.description || '',
        url: `/projects/${project.id}`,
      })),
      spaces: spaces.map((space) => ({
        id: space.id,
        type: 'space',
        title: space.name,
        content: space.description || '',
        url: `/spaces/${space.id}`,
      })),
      tutorials: tutorials.map((tutorial) => ({
        id: tutorial.id,
        type: 'tutorial',
        title: tutorial.title,
        content: tutorial.content || '',
        url: `/tutorials/${tutorial.id}`,
      })),
      users: users.map((user) => ({
        id: user.id,
        type: 'user',
        title: `${user.username}`,
        content: user.bio || '',
        url: `/profile/${user.username}`,
        image: user.avatar,
      })),
    };

    console.log(results);

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
      results
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}