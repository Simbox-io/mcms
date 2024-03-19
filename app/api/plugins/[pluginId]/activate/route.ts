import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { pluginId: string } }) {
  const { pluginId } = params;

  try {
    const updatedPlugin = await prisma.plugin.update({
      where: { id: pluginId },
      data: { active: true },
    });

    return NextResponse.json(updatedPlugin);
  } catch (error) {
    console.error('Error activating plugin:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}