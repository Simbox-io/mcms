// app/api/users/[id]/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = auth();
    const userObj = await currentUser();


  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = params.id;

  try {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        tags: true,
        comments: true,
        bookmarks: true,
        settings: {
          include: {
            commentSettings: true,
            sharingSettings: true,
            revisionHistorySettings: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}