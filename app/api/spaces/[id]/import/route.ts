// app/api/spaces/[id]/import/route.ts
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

  const spaceId = params.id;
  const { format, data } = await request.json();

  try {
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: true,
      },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.owner.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Perform the import based on the specified format
    let importedData;

    switch (format) {
      case 'json':
        importedData = JSON.parse(data);
        break;
      case 'markdown':
        // TODO: Parse markdown data and convert to space data
        // ...
        importedData = { /* parsed space data */ };
        break;
      case 'html':
        // TODO: Parse HTML data and convert to space data
        // ...
        importedData = { /* parsed space data */ };
        break;
      default:
        return NextResponse.json({ message: 'Invalid import format' }, { status: 400 });
    }

    // Update the space with the imported data
    const updatedSpace = await prisma.space.update({
      where: { id: spaceId },
      data: importedData,
    });

    return NextResponse.json(updatedSpace);
  } catch (error) {
    console.error('Error importing space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}