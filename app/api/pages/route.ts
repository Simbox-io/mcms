// app/api/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = auth();
  const userObj = await currentUser();

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, spaceId } = await request.json();

  try {
    const newPage = await prisma.page.create({
      data: {
        title,
        content,
        space: { connect: { id: spaceId } },
        settings: {
          create: {
            seoSettings: {
              create: {},
            },
            revisionHistorySettings: {
              create: {
                revisionsToKeep: 10,
              },
            },
            commentingSettings: {
              create: {
                allowComments: true,
                moderateComments: false,
              },
            },
          },
        },
      },
      include: {
        space: true,
        comments: true,
        bookmarks: true,
        settings: {
          include: {
            seoSettings: true,
            revisionHistorySettings: true,
            commentingSettings: true,
          },
        },
      },
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}