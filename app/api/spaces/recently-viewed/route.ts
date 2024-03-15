// app/api/spaces/recently-viewed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const session = await getSession(request);
    const user = session?.user as User;

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const recentlyViewedSpaces = await prisma.space.findMany({
            where: {
                views: {
                    some: {
                        userId: user.id,
                    },
                },
            },
            take: 5,
            include: {
                author: {
                    select: { id: true, username: true },
                },
                project: {
                    select: { id: true, name: true },
                },
            },
        });

        return NextResponse.json(recentlyViewedSpaces);
    } catch (error) {
        console.error('Error fetching recently viewed spaces:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}