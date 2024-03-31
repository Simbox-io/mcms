import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import prisma, { Comment } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const user = await currentUser();
    const username = user?.username;
  
    if (!username) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  
    const commentId = params.id;
  
    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      }) as unknown as Comment;

      if (!comment) {
        return NextResponse.json({ message: 'Comment not found' }, { status: 404 });
      }

      const updatedComment = await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          downvotes: {
            increment: 1,
          },
          likedBy:{ 
            disconnect: {
              username: username,
            },
          },
          dislikedBy: {
            connect: {
              username: username,
            },
          },
        },
      });

      return NextResponse.json(updatedComment);
    } catch (error) {
      console.error('Error creating comment reaction:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }