// app/api/spaces/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = 10;
    const search = searchParams.get('search') || '';

    try {
        const totalSpaces = await prisma.space.count({
            where: {
                title: {
                    contains: search,
                },
            },
        });
        const totalPages = Math.ceil(totalSpaces / perPage);
        const spaces = await prisma.space.findMany({
            where: {
                title: {
                    contains: search,
                },
            },
            skip: (page - 1) * perPage,
            take: perPage,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, username: true },
                },
                project: {
                    select: { id: true, name: true },
                },
            },
        });

        return NextResponse.json({ spaces, totalPages });
    } catch (error) {
        console.error('Error fetching spaces:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getSession(request);
    const user = session?.user as User;

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, projectId } = await request.json();

    try {
        const newSpace = await prisma.space.create({
            data: {
                title,
                description,
                author: {
                    connect: { id: user.id },
                },
                project: projectId
                    ? {
                        connect: { id: projectId },
                    }
                    : undefined,
            },
        });

        return NextResponse.json(newSpace, { status: 201 });
    } catch (error) {
        console.error('Error creating space:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}