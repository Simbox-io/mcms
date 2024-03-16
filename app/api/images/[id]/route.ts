// app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma, { Image } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const imageId = parseInt(params.id);

  try {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const imageId = parseInt(params.id);
  const { data, contentType } = await request.json();

  try {
    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: {
        data,
        contentType,
      },
    });

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const imageId = parseInt(params.id);

  try {
    await prisma.image.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}