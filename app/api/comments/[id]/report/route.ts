import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userObj = await currentUser();

  if(!userObj) {
    return NextResponse.json({ message: "You must be logged in to report a comment" }, { status: 401 });
  }

  const { id } = params;
  
  const comment = await prisma.comment.findUnique({
    where: { id },
  });
}

