// app/api/pages/[id]/versions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;

  try {
    const versions = await prisma.page.findMany({
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

    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching page versions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}