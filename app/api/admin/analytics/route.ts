// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalUsers, totalPosts, totalProjects, totalFiles, totalSpaces, totalTutorials] = await Promise.all([
      cachedPrisma.user.count(),
      cachedPrisma.post.count(),
      cachedPrisma.project.count(),
      cachedPrisma.file.count(),
      cachedPrisma.space.count(),
      cachedPrisma.tutorial.count(),
    ]);

    const analytics = {
      totalUsers,
      totalPosts,
      totalProjects,
      totalFiles,
      totalSpaces,
      totalTutorials,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}