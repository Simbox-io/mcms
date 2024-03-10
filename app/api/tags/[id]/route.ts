// app/api/tags/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const tagId = parseInt(params.id);

  try {
    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
          },
        },
        files: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ message: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}