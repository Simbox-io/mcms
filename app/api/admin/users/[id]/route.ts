// app/api/admin/users/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getSession } from '../../../../../lib/auth';
import { User } from '@prisma/client';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}