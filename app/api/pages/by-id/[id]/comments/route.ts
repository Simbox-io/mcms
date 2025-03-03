// app/api/pages/by-id/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;

  try {
    const comments = await cachedPrisma.comment.findMany({
      where: { pageId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        reactions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;
  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Check if page exists
    const page = await cachedPrisma.page.findUnique({
      where: { id: pageId },
      include: {
        settings: {
          include: {
            commentingSettings: true,
          },
        },
      },
    });
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    // Check if commenting is enabled
    if (!page.settings?.commentingSettings?.enableComments) {
      return NextResponse.json({ error: 'Comments are disabled for this page' }, { status: 403 });
    }
    
    // Create comment
    const comment = await cachedPrisma.comment.create({
      data: {
        content: body.content,
        pageId,
        authorId: (session.user as User).id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
