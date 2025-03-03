// app/api/spaces/[id]/export/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import cachedPrisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const spaceId = params.id;
  const format = request.nextUrl.searchParams.get('format');

  try {
    const space = await cachedPrisma.space.findUnique({
      where: { id: spaceId },
      include: {
        owner: true,
        collaborators: true,
        pages: true,
      },
    });

    if (!space) {
      return NextResponse.json({ message: 'Space not found' }, { status: 404 });
    }

    if (space.owner.id !== userObj.id && !space.collaborators.some((collaborator) => collaborator.id === userObj.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Perform the export based on the specified format
    let exportedData: string;

    switch (format) {
      case 'json':
        exportedData = JSON.stringify(space);
        break;
      case 'markdown':
        // Convert space data to markdown format
        let markdownContent = `# ${space.title}\n\n`;
        
        if (space.description) {
          markdownContent += `## Description\n\n${space.description}\n\n`;
        }
        
        if (space.pages && space.pages.length > 0) {
          markdownContent += `## Pages\n\n`;
          
          space.pages.forEach(page => {
            markdownContent += `### ${page.title}\n\n${page.content}\n\n`;
          });
        }
        
        exportedData = markdownContent;
        break;
      case 'html':
        // Convert space data to HTML format
        let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${space.title}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #1e40af; }
    h2 { color: #1e3a8a; margin-top: 2rem; }
    h3 { color: #1e3a8a; margin-top: 1.5rem; }
    .page { margin-bottom: 3rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; }
    .page-title { margin-top: 0; }
  </style>
</head>
<body>
  <h1>${space.title}</h1>`;
        
        if (space.description) {
          htmlContent += `\n  <div class="description">
    <p>${space.description}</p>
  </div>`;
        }
        
        if (space.pages && space.pages.length > 0) {
          htmlContent += `\n  <h2>Pages</h2>`;
          
          space.pages.forEach(page => {
            htmlContent += `\n  <div class="page">
    <h3 class="page-title">${page.title}</h3>
    <div class="page-content">
      ${page.content}
    </div>
  </div>`;
          });
        }
        
        htmlContent += `\n</body>
</html>`;
        
        exportedData = htmlContent;
        break;
      default:
        return NextResponse.json({ message: 'Invalid export format' }, { status: 400 });
    }

    return new NextResponse(exportedData, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="space_${spaceId}.${format}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting space:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}