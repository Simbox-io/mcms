// app/api/admin/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Default posts for when the table doesn't exist
const defaultPosts = [
  {
    id: "1",
    title: "Welcome to MCMS",
    slug: "welcome-to-mcms",
    content: "This is a placeholder post.",
    createdAt: new Date().toISOString(),
    author: {
      id: "1",
      username: "admin",
      firstName: "Admin",
      lastName: "User"
    }
  }
];

export async function GET() {
  try {
    // Check if Post table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Post'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('Post table does not exist');
      return NextResponse.json(defaultPosts);
    }
    
    // Check if User table exists
    const userTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'User'
      );
    `;
    
    // Get columns for Post table
    const postColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Post'
    `;
    
    const postColumnNames = postColumns.map((col: any) => col.column_name.toLowerCase());
    console.log('Available Post columns:', postColumnNames);
    
    // Check if User table has avatar column
    let hasAvatarColumn = false;
    if (userTableExists[0].exists) {
      const avatarColumnExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'User' AND column_name = 'avatar'
        );
      `;
      hasAvatarColumn = avatarColumnExists[0].exists;
    }
    
    try {
      // Try simplified query first
      const authorSelect = {
        id: true,
        username: true,
        firstName: true,
        lastName: true
      };
      
      // Only add avatar field if it exists
      if (hasAvatarColumn) {
        // @ts-ignore - Adding field dynamically
        authorSelect.avatar = true;
      }
      
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc"
        },
        include: {
          author: {
            select: authorSelect
          }
        }
      });
      
      return NextResponse.json(posts);
    } catch (prismaError) {
      console.error('Error fetching posts with Prisma:', prismaError);
      
      // Try with raw SQL
      try {
        let query;
        
        if (userTableExists[0].exists) {
          // Join with User table if it exists
          const avatarSelect = hasAvatarColumn ? ', u.avatar as author_avatar' : '';
          
          query = `
            SELECT 
              p.id, p.title, p.slug, p.content, p."createdAt", p."updatedAt", 
              u.id as author_id, u.username as author_username, 
              u."firstName" as author_firstName, u."lastName" as author_lastName${avatarSelect}
            FROM "Post" p
            LEFT JOIN "User" u ON p."authorId" = u.id
            ORDER BY p."createdAt" DESC
          `;
        } else {
          // Just get posts without author info
          query = `
            SELECT id, title, slug, content, "createdAt", "updatedAt"
            FROM "Post"
            ORDER BY "createdAt" DESC
          `;
        }
        
        const rawPosts = await prisma.$queryRawUnsafe(query);
        
        // Transform the results to match expected structure
        const formattedPosts = rawPosts.map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          status: post.status || 'draft',
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          ...(post.author_id ? {
            author: {
              id: post.author_id,
              username: post.author_username,
              firstName: post.author_firstName,
              lastName: post.author_lastName,
              ...(post.author_avatar ? { avatar: post.author_avatar } : {})
            }
          } : {})
        }));
        
        return NextResponse.json(formattedPosts);
      } catch (sqlError) {
        console.error('Error with raw SQL posts query:', sqlError);
        return NextResponse.json(defaultPosts);
      }
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(defaultPosts);
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const user = session?.user as User;

  if (!session || user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, authorId, tags, settings } = await request.json();

  try {
    const newPost = await cachedPrisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: authorId } },
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        settings: settings
          ? {
              create: {
                defaultVisibility: settings.defaultVisibility,
                commentSettings: settings.commentSettings
                  ? {
                      create: {
                        allowComments: settings.commentSettings.allowComments,
                        moderateComments: settings.commentSettings.moderateComments,
                      },
                    }
                  : undefined,
                sharingSettings: settings.sharingSettings
                  ? {
                      create: {
                        allowSharing: settings.sharingSettings.allowSharing,
                        sharePlatforms: settings.sharingSettings.sharePlatforms,
                      },
                    }
                  : undefined,
                revisionHistorySettings: settings.revisionHistorySettings
                  ? {
                      create: {
                        revisionsToKeep: settings.revisionHistorySettings.revisionsToKeep,
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}