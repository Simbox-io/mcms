// app/api/spaces/[id]/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;
  const format = request.nextUrl.searchParams.get('format');

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: true,
        collaborators: true,
        pages: true,
      },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.owner.id !== userObj.id && !space.collaborators.some((collaborator) => collaborator.id === userObj.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Perform the export based on the specified format
    let exportedData: string;

    switch (format) {
      case 'json':
        exportedData = JSON.stringify(space);
        break;
      case 'markdown':
        // TODO: Convert space data to markdown format
        // ...
        exportedData = '# Markdown export\n\n...';
        break;
      case 'html':
        // TODO: Convert space data to HTML format
        // ...
        exportedData = '<h1>HTML export</h1>\n\n...';
        break;
      default:
        return NextResponse.json({ message: 'Invalid export format' }, { status: 400 });
    }

    return new NextResponse(exportedData, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="space_${spaceId}.${format}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}