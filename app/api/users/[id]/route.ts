// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma, { User } from '../../../../lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const projects = await prisma.project.findMany({
      where: { ownerId: userId },
      include: {
        owner: true,
      },
    });

    const files = await prisma.file.findMany({
      where: { uploadedById: userId },
    });

    const spaces = await prisma.space.findMany({
      where: { authorId: userId },
      include: {
        author: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user, projects, files, spaces });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}