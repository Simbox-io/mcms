// app/api/admin/plugins/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const plugins = await prisma.plugin.findMany();

    return NextResponse.json(plugins);
  } catch (error) {
    console.error('Error fetching plugins:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { name, description, version } = await request.json();

  try {
    const newPlugin = await prisma.plugin.create({
      data: {
        name,
        description,
        version,
      },
    });

    return NextResponse.json(newPlugin, { status: 201 });
  } catch (error) {
    console.error('Error installing plugin:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}