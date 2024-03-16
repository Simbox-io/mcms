// app/api/pages/[id]/revert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const pageId = params.id;
  const { version } = await request.json();

  try {
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: {
        space: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    if (page.space.owner.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const versionToRevert = await prisma.page.findFirst({
      where: {
        id: pageId,
        version,
      },
    });

    if (!versionToRevert) {
      return NextResponse.json({ message: 'Version not found' }, { status: 404 });
    }

    const revertedPage = await prisma.page.update({
      where: { id: pageId },
      data: {
        title: versionToRevert.title,
        content: versionToRevert.content,
        version: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(revertedPage);
  } catch (error) {
    console.error('Error reverting page:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}