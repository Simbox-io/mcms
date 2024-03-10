// app/api/admin/plugins/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const pluginId = parseInt(params.id);

  try {
    await prisma.plugin.delete({
      where: {
        id: pluginId,
      },
    });

    return NextResponse.json({ message: 'Plugin uninstalled successfully' });
  } catch (error) {
    console.error('Error uninstalling plugin:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}