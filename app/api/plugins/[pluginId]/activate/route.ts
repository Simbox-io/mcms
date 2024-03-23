import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: { pluginId: string } }) {
  const { pluginId } = params;

  try {
    const updatedPlugin = await cachedPrisma.plugin.update({
      where: { id: pluginId },
      data: { active: true },
    });

    return NextResponse.json(updatedPlugin);
  } catch (error) {
    console.error('Error activating plugin:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}