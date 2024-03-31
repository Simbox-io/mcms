// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = auth();
  const user = await currentUser();

  if(!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userObj = await prisma.user.findUnique({
    where: {
      id: user.id
    }
  }) as unknown as User;

  if (!session || userObj?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [totalUsers, totalPosts, totalProjects, totalFiles, totalSpaces, totalTutorials] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.project.count(),
      prisma.file.count(),
      prisma.space.count(),
      prisma.tutorial.count(),
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