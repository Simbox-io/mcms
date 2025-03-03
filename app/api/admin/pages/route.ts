import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const pages = await prisma.page.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        sections: true,
        contentTypes: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }
    
    // Check if slug is already used
    const existingPage = await prisma.page.findUnique({
      where: { slug: body.slug },
    });
    
    if (existingPage) {
      return NextResponse.json(
        { error: 'Slug is already in use' },
        { status: 400 }
      );
    }
    
    // If setting as home page, unset any existing home page
    if (body.isHomePage) {
      await prisma.page.updateMany({
        where: { isHomePage: true },
        data: { isHomePage: false },
      });
    }
    
    // Create the page
    const page = await prisma.page.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        isPublished: body.isPublished || false,
        isHomePage: body.isHomePage || false,
        layout: body.layout || 'default',
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        featuredImage: body.featuredImage,
        author: {
          connect: { id: session.user.id },
        },
        // Create sections if provided
        sections: body.sections?.length ? {
          create: body.sections.map((section: any, index: number) => ({
            name: section.name,
            type: section.type,
            content: section.content || {},
            order: index,
            isEnabled: section.isEnabled !== undefined ? section.isEnabled : true,
            settings: section.settings || {},
          }))
        } : undefined,
        // Create content types if provided
        contentTypes: body.contentTypes?.length ? {
          create: body.contentTypes.map((contentType: any) => ({
            contentType: contentType.contentType,
            displayMode: contentType.displayMode || 'list',
            limit: contentType.limit || 10,
            filterBy: contentType.filterBy || {},
            sortBy: contentType.sortBy || 'createdAt',
            sortDirection: contentType.sortDirection || 'desc',
            isEnabled: contentType.isEnabled !== undefined ? contentType.isEnabled : true,
            settings: contentType.settings || {},
          }))
        } : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        sections: true,
        contentTypes: true,
      },
    });
    
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
