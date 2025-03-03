// app/api/admin/modules/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { slug } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const module = await cachedPrisma.moduleConfig.findUnique({
      where: { slug },
    });

    if (!module) {
      return NextResponse.json(
        { message: 'Module not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { message: 'Error fetching module' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { slug } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      name,
      description,
      isEnabled,
      icon,
      settings,
      permissions,
      requiredRole,
      adminRoute,
      displayOrder,
      newSlug,
    } = await request.json();

    // Check if the module exists
    const existingModule = await cachedPrisma.moduleConfig.findUnique({
      where: { slug },
    });

    if (!existingModule) {
      return NextResponse.json(
        { message: 'Module not found' },
        { status: 404 }
      );
    }

    // If changing the slug, check if the new slug is available
    if (newSlug && newSlug !== slug) {
      const moduleWithNewSlug = await cachedPrisma.moduleConfig.findUnique({
        where: { slug: newSlug },
      });

      if (moduleWithNewSlug) {
        return NextResponse.json(
          { message: 'A module with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (isEnabled !== undefined) updateData.isEnabled = isEnabled;
    if (icon !== undefined) updateData.icon = icon;
    if (settings !== undefined) updateData.settings = settings;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (requiredRole !== undefined) updateData.requiredRole = requiredRole;
    if (adminRoute !== undefined) updateData.adminRoute = adminRoute;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (newSlug) updateData.slug = newSlug;

    const module = await cachedPrisma.moduleConfig.update({
      where: { id: existingModule.id },
      data: updateData,
    });

    return NextResponse.json(module);
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { message: 'Error updating module' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { slug } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the module exists
    const existingModule = await cachedPrisma.moduleConfig.findUnique({
      where: { slug },
    });

    if (!existingModule) {
      return NextResponse.json(
        { message: 'Module not found' },
        { status: 404 }
      );
    }

    await cachedPrisma.moduleConfig.delete({
      where: { id: existingModule.id },
    });

    return NextResponse.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { message: 'Error deleting module' },
      { status: 500 }
    );
  }
}
