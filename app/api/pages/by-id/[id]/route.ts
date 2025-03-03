// app/api/pages/by-id/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;

  try {
    const page = await cachedPrisma.page.findUnique({
      where: { id: pageId },
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

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;
  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Check if page exists
    const existingPage = await cachedPrisma.page.findUnique({
      where: { id: pageId },
      include: {
        space: true,
      },
    });
    
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    // Check if user has permission to edit the page
    const user = session.user as User;
    const isAuthor = existingPage.authorId === user.id;
    const isSpaceCollaborator = existingPage.space && await cachedPrisma.spaceCollaborator.findFirst({
      where: {
        spaceId: existingPage.spaceId,
        userId: user.id,
      },
    });
    
    if (!isAuthor && !isSpaceCollaborator && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Update page
    const updatedPage = await cachedPrisma.page.update({
      where: { id: pageId },
      data: {
        title: body.title,
        content: body.content,
        isPublished: body.isPublished,
        updatedAt: new Date(),
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
    
    // Create version history if enabled
    if (updatedPage.settings?.revisionHistorySettings?.enableVersionHistory) {
      await cachedPrisma.pageVersion.create({
        data: {
          pageId,
          title: updatedPage.title,
          content: updatedPage.content,
          authorId: user.id,
        },
      });
    }
    
    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const pageId = params.id;
  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if page exists
    const existingPage = await cachedPrisma.page.findUnique({
      where: { id: pageId },
      include: {
        space: true,
      },
    });
    
    if (!existingPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    
    // Check if user has permission to delete the page
    const user = session.user as User;
    const isAuthor = existingPage.authorId === user.id;
    const isSpaceAdmin = existingPage.space && await cachedPrisma.spaceCollaborator.findFirst({
      where: {
        spaceId: existingPage.spaceId,
        userId: user.id,
        role: 'ADMIN',
      },
    });
    
    if (!isAuthor && !isSpaceAdmin && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Delete page
    await cachedPrisma.page.delete({
      where: { id: pageId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
