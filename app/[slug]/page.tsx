import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import prisma from '@/lib/prisma';
import PageRenderer from '@/components/page/PageRenderer';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch page data
  const page = await prisma.page.findUnique({
    where: { 
      slug: params.slug,
      isPublished: true,
    },
  });
  
  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }
  
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.description,
  };
}

export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  
  // Fetch page data with all related content
  const page = await prisma.page.findUnique({
    where: { 
      slug,
      isPublished: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
      sections: {
        where: {
          isEnabled: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
      contentTypes: {
        where: {
          isEnabled: true,
        },
      },
    },
  });
  
  if (!page) {
    notFound();
  }
  
  return (
    <div className={`page-container layout-${page.layout}`}>
      <PageRenderer page={page} />
    </div>
  );
}
