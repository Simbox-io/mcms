import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: number };
    const notifications = await prisma.notification.findMany({
      where: { userId: decoded.userId },
      select: { id: true, message: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}