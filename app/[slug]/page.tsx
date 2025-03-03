import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { PrismaClient } from '@prisma/client';
import PageRenderer from '@/components/page/PageRenderer';

interface PageProps {
  params: {
    slug: string;
  };
}

const prisma = new PrismaClient();

// Default fallback pages for when the table doesn't exist
const defaultPages = [
  { slug: 'about', title: 'About Us', description: 'Learn more about our company' },
  { slug: 'contact', title: 'Contact Us', description: 'Get in touch with our team' },
  { slug: 'terms', title: 'Terms of Service', description: 'Our terms and conditions' },
  { slug: 'privacy', title: 'Privacy Policy', description: 'How we handle your data' }
];

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // Check if the Page table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Page'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log(`Page table does not exist for metadata - checking if "${params.slug}" is a default page`);
      // Find a matching default page
      const defaultPage = defaultPages.find(page => page.slug === params.slug);
      
      if (defaultPage) {
        return {
          title: defaultPage.title,
          description: defaultPage.description,
        };
      }
      
      // Generic fallback for unknown pages
      return {
        title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
        description: `Information about ${params.slug}`,
      };
    }
    
    // Check if isPublished column exists
    const hasPublishedColumn = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'Page' AND column_name = 'isPublished'
      );
    `;
    
    try {
      let page;
      
      if (hasPublishedColumn[0].exists) {
        // Try with published filter if the column exists
        page = await prisma.page.findUnique({
          where: { 
            slug: params.slug,
            isPublished: true,
          },
          select: {
            title: true,
            description: true,
            metaTitle: true,
            metaDescription: true,
          }
        });
      } else {
        // Just get by slug if no published column
        page = await prisma.page.findUnique({
          where: { slug: params.slug },
          select: {
            title: true,
            description: true,
            metaTitle: true,
            metaDescription: true,
          }
        });
      }
      
      if (!page) {
        // Find a matching default page if no page found
        const defaultPage = defaultPages.find(page => page.slug === params.slug);
        
        if (defaultPage) {
          return {
            title: defaultPage.title,
            description: defaultPage.description,
          };
        }
        
        // Generic fallback
        return {
          title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
          description: `Information about ${params.slug}`,
        };
      }
      
      return {
        title: page.metaTitle || page.title,
        description: page.metaDescription || page.description,
      };
    } catch (prismaError) {
      console.error(`Error fetching page metadata for "${params.slug}":`, prismaError);
      
      // Try with raw SQL
      try {
        let query;
        
        if (hasPublishedColumn[0].exists) {
          query = `
            SELECT title, description, "metaTitle", "metaDescription"
            FROM "Page"
            WHERE slug = '${params.slug.replace(/'/g, "''")}'
            AND "isPublished" = true
          `;
        } else {
          query = `
            SELECT title, description, "metaTitle", "metaDescription"
            FROM "Page"
            WHERE slug = '${params.slug.replace(/'/g, "''")}'
          `;
        }
        
        const results = await prisma.$queryRawUnsafe(query);
        
        if (results && results.length > 0) {
          const page = results[0];
          return {
            title: page.metaTitle || page.title,
            description: page.metaDescription || page.description,
          };
        }
      } catch (sqlError) {
        console.error(`Error with raw SQL for page metadata "${params.slug}":`, sqlError);
      }
      
      // Find a matching default page if all else fails
      const defaultPage = defaultPages.find(page => page.slug === params.slug);
      
      if (defaultPage) {
        return {
          title: defaultPage.title,
          description: defaultPage.description,
        };
      }
      
      // Final fallback
      return {
        title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
        description: `Information about ${params.slug}`,
      };
    }
  } catch (error) {
    console.error(`Error generating metadata for "${params.slug}":`, error);
    
    // Find a matching default page if all else fails
    const defaultPage = defaultPages.find(page => page.slug === params.slug);
    
    if (defaultPage) {
      return {
        title: defaultPage.title,
        description: defaultPage.description,
      };
    }
    
    // Final fallback
    return {
      title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1),
      description: `Information about ${params.slug}`,
    };
  }
}

export async function generateStaticParams() {
  try {
    // Check if the Page table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Page'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('Page table does not exist - using default slugs');
      return defaultPages;
    }
    
    // Check if the Page table has isPublished column
    const hasPublishedColumn = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'Page' AND column_name = 'isPublished'
      );
    `;
    
    try {
      if (hasPublishedColumn[0].exists) {
        // Try with isPublished filter if the column exists
        const pages = await prisma.page.findMany({
          where: { isPublished: true },
          select: { slug: true },
        });
        return pages;
      } else {
        // Get all pages if isPublished column doesn't exist
        const pages = await prisma.page.findMany({
          select: { slug: true },
        });
        return pages;
      }
    } catch (prismaError) {
      console.error('Error fetching pages with Prisma:', prismaError);
      
      // Try with raw SQL as fallback
      try {
        let query;
        if (hasPublishedColumn[0].exists) {
          query = `
            SELECT slug FROM "Page" 
            WHERE "isPublished" = true
          `;
        } else {
          query = `SELECT slug FROM "Page"`;
        }
        
        const rawPages = await prisma.$queryRawUnsafe(query);
        
        if (rawPages && rawPages.length > 0) {
          return rawPages;
        }
      } catch (sqlError) {
        console.error('Error with raw SQL page query:', sqlError);
      }
    }
  } catch (error) {
    console.error("Error generating static params:", error);
  }
  
  // Return default pages if all else fails
  return defaultPages;
}

export default async function Page({ params }: PageProps) {
  try {
    // Check if the Page table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Page'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log(`Page table does not exist - checking if "${params.slug}" is a default page`);
      // Check if requested slug is in our default pages
      if (defaultPages.some(page => page.slug === params.slug)) {
        return (
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">{params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}</h1>
            <p>This is a placeholder page for "{params.slug}". The actual content will be available once the database is properly set up.</p>
          </div>
        );
      }
      return notFound();
    }
    
    // Try to get the page data with error handling
    let pageData = null;
    
    try {
      pageData = await prisma.page.findUnique({
        where: { slug: params.slug },
      });
    } catch (error) {
      console.error(`Error fetching page data for slug "${params.slug}":`, error);
      
      // Check if this is one of our default slugs
      if (defaultPages.some(page => page.slug === params.slug)) {
        return (
          <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">{params.slug.charAt(0).toUpperCase() + params.slug.slice(1)}</h1>
            <p>This is a placeholder page for "{params.slug}". The actual content will be available once the database is properly set up.</p>
          </div>
        );
      }
    }
    
    if (!pageData) {
      return notFound();
    }
    
    return (
      <div className={`page-container layout-${pageData.layout}`}>
        <PageRenderer page={pageData} />
      </div>
    );
  } catch (error) {
    console.error(`Error rendering page "${params.slug}":`, error);
    return notFound();
  }
}
