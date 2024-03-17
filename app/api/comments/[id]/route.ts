import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { User } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { content, postId, fileId, projectId, pageId, parentId, tutorialId, settings } = await request.json();

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userObj.id } },
        post: postId ? { connect: { id: postId } } : undefined,
        file: fileId ? { connect: { id: fileId } } : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
        page: pageId ? { connect: { id: pageId } } : undefined,
        parent: parentId ? { connect: { id: parentId } } : undefined,
        tutorial: tutorialId ? { connect: { id: tutorialId } } : undefined,
        settings: {
          create: {
            moderationSettings: {
              create: {
                preModeration: settings?.moderationSettings?.preModeration || false,
                postModeration: settings?.moderationSettings?.postModeration || false,
              },
            },
            threadingSettings: {
              create: {
                allowNesting: settings?.threadingSettings?.allowNesting || false,
                maxDepth: settings?.threadingSettings?.maxDepth || 0,
              },
            },
            votingSettings: {
              create: {
                allowVoting: settings?.votingSettings?.allowVoting || false,
                hideThreshold: settings?.votingSettings?.hideThreshold || 0,
              },
            },
            postSettings: postId
              ? {
                  create: {
                    post: {
                      connect: { id: postId },
                    },
                  },
                }
              : undefined,
          },
        },
      },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        post: true,
        file: true,
        project: true,
        page: true,
        parent: true,
        tutorial: true,
        settings: {
          include: {
            moderationSettings: true,
            threadingSettings: true,
            votingSettings: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const commentId = params.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        post: true,
        file: true,
        project: true,
        page: true,
        parent: true,
        children: true,
        reactions: true,
        tutorial: true,
        settings: {
          include: {
            moderationSettings: true,
            threadingSettings: true,
            votingSettings: true,
          },
        },
      },
    });

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const commentId = params.id;
  const { content, settings } = await request.json();

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
        settings: settings
          ? {
              update: {
                moderationSettings: settings.moderationSettings
                  ? {
                      update: {
                        preModeration: settings.moderationSettings.preModeration,
                        postModeration: settings.moderationSettings.postModeration,
                      },
                    }
                  : undefined,
                threadingSettings: settings.threadingSettings
                  ? {
                      update: {
                        allowNesting: settings.threadingSettings.allowNesting,
                        maxDepth: settings.threadingSettings.maxDepth,
                      },
                    }
                  : undefined,
                votingSettings: settings.votingSettings
                  ? {
                      update: {
                        allowVoting: settings.votingSettings.allowVoting,
                        hideThreshold: settings.votingSettings.hideThreshold,
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        post: true,
        file: true,
        project: true,
        page: true,
        parent: true,
        children: true,
        reactions: true,
        tutorial: true,
        settings: {
          include: {
            moderationSettings: true,
            threadingSettings: true,
            votingSettings: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const commentId = params.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
    }

    if (comment.author.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
