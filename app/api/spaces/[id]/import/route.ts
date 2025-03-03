// app/api/spaces/[id]/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;
  const { format, data } = await request.json();

  try {
    const space = await cachedPrisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: true,
      },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.owner.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Perform the import based on the specified format
    let importedData;

    switch (format) {
      case 'json':
        importedData = JSON.parse(data);
        break;
      case 'markdown':
        // Parse markdown data and convert to space data
        const markdownContent = data;
        const titleMatch = markdownContent.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : 'Imported Space';
        
        // Extract content sections
        const sections = markdownContent.split(/^## (.+)$/m).filter(Boolean);
        const description = sections.length > 1 ? sections[1].trim() : '';
        
        // Extract any pages
        const pageMatches = markdownContent.match(/^### (.+)$([\s\S]+?)(?=^###|\n\n|$)/gm) || [];
        const pages = pageMatches.map(pageMatch => {
          const [pageTitleMatch, ...pageContentParts] = pageMatch.split(/\n/);
          const pageTitle = pageTitleMatch.replace(/^### /, '');
          const pageContent = pageContentParts.join('\n').trim();
          return { title: pageTitle, content: pageContent };
        });
        
        importedData = { 
          title,
          description,
          pages: {
            create: pages.map(page => ({
              title: page.title,
              content: page.content,
              status: 'PUBLISHED'
            }))
          }
        };
        break;
      case 'html':
        // Parse HTML data and convert to space data
        const htmlContent = data;
        
        // Create a DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Extract title from h1
        const htmlTitle = doc.querySelector('h1')?.textContent || 'Imported Space';
        const htmlDescription = doc.querySelector('p')?.textContent || '';
        
        // Extract pages from h3 elements
        const htmlPages = [];
        const h3Elements = doc.querySelectorAll('h3');
        for (const h3 of h3Elements) {
          const pageTitle = h3.textContent || 'Untitled Page';
          let pageContent = '';
          let sibling = h3.nextElementSibling;
          
          while (sibling && sibling.tagName !== 'H3') {
            pageContent += sibling.outerHTML;
            sibling = sibling.nextElementSibling;
          }
          
          htmlPages.push({
            title: pageTitle,
            content: pageContent,
          });
        }
        
        importedData = { 
          title: htmlTitle,
          description: htmlDescription,
          pages: {
            create: htmlPages.map(page => ({
              title: page.title,
              content: page.content,
              status: 'PUBLISHED'
            }))
          }
        };
        break;
      default:
        return NextResponse.json({ message: 'Invalid import format' }, { status: 400 });
    }

    // Update the space with the imported data
    const updatedSpace = await cachedPrisma.space.update({
      where: { id: spaceId },
      data: importedData,
    });

    return NextResponse.json(updatedSpace);
  } catch (error) {
    console.error('Error importing space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}