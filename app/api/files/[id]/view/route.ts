// app/api/files/[id]/view/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;

  try {
    const file = await prisma.file.update({
      where: { id: fileId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error updating file views:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}