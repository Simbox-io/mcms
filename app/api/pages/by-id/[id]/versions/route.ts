// app/api/pages/by-id/[id]/versions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;

  try {
    const versions = await cachedPrisma.page.findMany({
      where: { id: pageId },
      select: {
        id: true,
        title: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        version: 'desc',
      },
    });

    if (!versions || versions.length === 0) {
      return NextResponse.json({ error: 'No versions found' }, { status: 404 });
    }

    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}
