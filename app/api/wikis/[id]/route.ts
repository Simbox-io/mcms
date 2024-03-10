// app/api/wikis/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const wikiId = parseInt(params.id);

  try {
    const wiki = await prisma.wiki.findUnique({
      where: {
        id: wikiId,
      },
    });

    if (!wiki) {
      return NextResponse.json({ message: 'Wiki not found' }, { status: 404 });
    }

    return NextResponse.json(wiki);
  } catch (error) {
    console.error('Error fetching wiki:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}