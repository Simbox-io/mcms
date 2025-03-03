// app/api/pages/by-id/[id]/revert/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
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
    const page = await cachedPrisma.page.findUnique({
      where: { id: pageId },
      include: {
        space: true,
      },
    });

    if (!page) {
      return NextResponse.json({ message: 'Page not found' }, { status: 404 });
    }

    // Check if user has permission to edit the page
    const isAuthor = page.authorId === userObj.id;
    const isSpaceCollaborator = page.space && await cachedPrisma.spaceCollaborator.findFirst({
      where: {
        spaceId: page.spaceId,
        userId: userObj.id,
      },
    });

    if (!isAuthor && !isSpaceCollaborator && userObj.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Get the specific version
    const versionToRevert = await cachedPrisma.pageVersion.findFirst({
      where: {
        pageId,
        version,
      },
    });

    if (!versionToRevert) {
      return NextResponse.json({ message: 'Version not found' }, { status: 404 });
    }

    // Update the page with the version data
    const updatedPage = await cachedPrisma.page.update({
      where: { id: pageId },
      data: {
        title: versionToRevert.title,
        content: versionToRevert.content,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error reverting page:', error);
    return NextResponse.json({ message: 'Failed to revert page' }, { status: 500 });
  }
}
