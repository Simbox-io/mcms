// app/api/admin/navigation/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { id } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const menu = await cachedPrisma.navigationMenu.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            children: {
              include: {
                children: true, // Support up to 3 levels of nesting
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!menu) {
      return NextResponse.json(
        { message: 'Navigation menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error fetching navigation menu:', error);
    return NextResponse.json(
      { message: 'Error fetching navigation menu' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { id } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, description, location } = await request.json();

    // Check if the menu exists
    const existingMenu = await cachedPrisma.navigationMenu.findUnique({
      where: { id },
    });

    if (!existingMenu) {
      return NextResponse.json(
        { message: 'Navigation menu not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (location) updateData.location = location;

    const menu = await cachedPrisma.navigationMenu.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error updating navigation menu:', error);
    return NextResponse.json(
      { message: 'Error updating navigation menu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession(request);
  const userObj = session?.user as User;
  const { id } = params;

  if (!userObj?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if the menu exists
    const existingMenu = await cachedPrisma.navigationMenu.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!existingMenu) {
      return NextResponse.json(
        { message: 'Navigation menu not found' },
        { status: 404 }
      );
    }

    // Delete the menu (this will cascade delete all items)
    await cachedPrisma.navigationMenu.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Navigation menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting navigation menu:', error);
    return NextResponse.json(
      { message: 'Error deleting navigation menu' },
      { status: 500 }
    );
  }
}
