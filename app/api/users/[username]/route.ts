// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = params.username;

  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        profile: true,
        settings: {
          include: {
            notificationPreferences: true,
            privacySettings: true,
            passwordResetSettings: true,
            accountDeletionSettings: true,
          },
        },
        posts: {
          include: {
            author: true,
            comments: true,
          },
        },
        comments: true,
        files: {
          include: {
            uploadedBy: true,
          },
        },
        ownedProjects: {
          include:
            { 
              owner: true,
              collaborators: true,
              spaces: true,
            },
        },
        collaboratedProjects: {
          include: {
            owner: true,
            collaborators: true,
            spaces: true,
          },
        },
        spaces: true,
        collaboratedSpaces: {
          include: {
            owner: true,
            collaborators: true,
          },
        },
        tutorials: {
          include: {
            author: true,
            collaborators: true,
          },
        },
        collaboratedTutorials: {
          include: {
            author: true,
            collaborators: true,
          },
        },
        bookmarks: true,
        commentReactions: true,
        fileReactions: true,
        notifications: true,
        activities: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}