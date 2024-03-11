// app/api/wikis/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { User } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalWikis = await prisma.wiki.count();
    const totalPages = Math.ceil(totalWikis / perPage);

    const wikis = await prisma.wiki.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ wikis, totalPages });
  } catch (error) {
    console.error('Error fetching wikis:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, projectId } = await request.json();

  try {
    const newWiki = await prisma.wiki.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: user.id,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });

    return NextResponse.json(newWiki, { status: 201 });
  } catch (error) {
    console.error('Error creating wiki:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}