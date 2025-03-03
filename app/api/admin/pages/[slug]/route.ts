import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const page = await prisma.page.findUnique({
      where: { id: params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        contentTypes: true,
      },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id: params.slug },
      include: {
        sections: true,
        contentTypes: true,
      },
    });
    
    if (!existingPage) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    // If changing slug, check if new slug is already used
    if (body.slug && body.slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug: body.slug },
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug is already in use' },
          { status: 400 }
        );
      }
    }
    
    // If setting as home page, unset any existing home page
    if (body.isHomePage && !existingPage.isHomePage) {
      await prisma.page.updateMany({
        where: { 
          isHomePage: true,
          id: { not: params.slug },
        },
        data: { isHomePage: false },
      });
    }
    
    // Update the page
    const updatedPage = await prisma.page.update({
      where: { id: params.slug },
      data: {
        title: body.title !== undefined ? body.title : undefined,
        slug: body.slug !== undefined ? body.slug : undefined,
        description: body.description !== undefined ? body.description : undefined,
        isPublished: body.isPublished !== undefined ? body.isPublished : undefined,
        isHomePage: body.isHomePage !== undefined ? body.isHomePage : undefined,
        layout: body.layout !== undefined ? body.layout : undefined,
        metaTitle: body.metaTitle !== undefined ? body.metaTitle : undefined,
        metaDescription: body.metaDescription !== undefined ? body.metaDescription : undefined,
        featuredImage: body.featuredImage !== undefined ? body.featuredImage : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
    
    // Handle sections update if provided
    if (body.sections) {
      // Delete existing sections
      await prisma.pageSection.deleteMany({
        where: { pageId: params.slug },
      });
      
      // Create new sections
      await Promise.all(body.sections.map(async (section: any, index: number) => {
        await prisma.pageSection.create({
          data: {
            name: section.name,
            type: section.type,
            content: section.content || {},
            order: index,
            isEnabled: section.isEnabled !== undefined ? section.isEnabled : true,
            settings: section.settings || {},
            page: {
              connect: { id: params.slug },
            },
          },
        });
      }));
    }
    
    // Handle content types update if provided
    if (body.contentTypes) {
      // Delete existing content types
      await prisma.pageContentType.deleteMany({
        where: { pageId: params.slug },
      });
      
      // Create new content types
      await Promise.all(body.contentTypes.map(async (contentType: any) => {
        await prisma.pageContentType.create({
          data: {
            contentType: contentType.contentType,
            displayMode: contentType.displayMode || 'list',
            limit: contentType.limit || 10,
            filterBy: contentType.filterBy || {},
            sortBy: contentType.sortBy || 'createdAt',
            sortDirection: contentType.sortDirection || 'desc',
            isEnabled: contentType.isEnabled !== undefined ? contentType.isEnabled : true,
            settings: contentType.settings || {},
            page: {
              connect: { id: params.slug },
            },
          },
        });
      }));
    }
    
    // Fetch the fully updated page with all relations
    const finalPage = await prisma.page.findUnique({
      where: { id: params.slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        contentTypes: true,
      },
    });
    
    return NextResponse.json(finalPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id: params.slug },
    });
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    // Delete the page (cascade will handle sections and content types)
    await prisma.page.delete({
      where: { id: params.slug },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
