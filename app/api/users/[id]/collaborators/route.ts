// app/api/users/[id]/collaborators/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession(request);
    const userObj = session?.user as User;

    if (!userObj) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;

    try {
        const collaborators = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                collaboratedProjects: {
                    select: {
                        collaborators: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
                collaboratedSpaces: {
                    select: {
                        collaborators: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
                collaboratedTutorials: {
                    select: {
                        collaborators: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true,
                            },
                        },
                    },
                },
            },
        });

        const projectCollaborators = (collaborators?.collaboratedProjects.flatMap(
            (project) => project.collaborators
        )) || [];
        const spaceCollaborators = (collaborators?.collaboratedSpaces.flatMap(
            (space) => space.collaborators
        )) || [];
        const tutorialCollaborators = (collaborators?.collaboratedTutorials.flatMap(
            (tutorial) => tutorial.collaborators
        )) || [];

        const allCollaborators = [...projectCollaborators, ...spaceCollaborators, ...tutorialCollaborators];
        const uniqueCollaborators = Array.from(
            new Set(allCollaborators.map((collaborator) => JSON.stringify(collaborator)))
        ).map((collaborator) => JSON.parse(collaborator));

        return NextResponse.json(uniqueCollaborators);
    } catch (error) {
        console.error('Error fetching user collaborators:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}