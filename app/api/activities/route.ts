// app/api/activities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma, { User }  from '@/lib/prisma';
import { auth, currentUser } from '@clerk/nextjs'
export async function GET(request: NextRequest) {
  const session = await auth();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = 10;

  try {
    const totalActivities = await prisma.activity.count({
      where: { userId: user.id },
    });
    const totalPages = Math.ceil(totalActivities / perPage);

    const activities = await prisma.activity.findMany({
      where: { userId: user.id },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ activities, totalPages });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { activityType, entityId, entityType } = await request.json();

  try {
    const newActivity = await prisma.activity.create({
      data: {
        user: { connect: { id: user.id } },
        activityType,
        entityId,
        entityType,
      },
    });

    return NextResponse.json(newActivity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}