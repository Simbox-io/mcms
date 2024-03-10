// app/api/admin/analytics/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalUsers, totalPosts, totalProjects, totalFiles] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.project.count(),
      prisma.file.count(),
    ]);

    const analytics = {
      totalUsers,
      totalPosts,
      totalProjects,
      totalFiles,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}