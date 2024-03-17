// app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        posts: true,
        files: true,
        projects: true,
        tutorials: true,
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();

  try {
    const newTag = await prisma.tag.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}