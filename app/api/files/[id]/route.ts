// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User, AdminSettings, File } from '@/lib/prisma';
import { getStorageProvider } from '@/lib/file-storage';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id;
  try {
    const [file, adminSettings] = await Promise.all([
      prisma.file.findUnique({
        where: {
          id: fileId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          project: true,
          tags: true,
          comments: true,
          parent: true,
          children: true,
          reactions: true,
          bookmarks: true,
          settings: {
            include: {
              uploadLimits: true,
              downloadSettings: true,
              expirationSettings: true,
              versioningSettings: true,
              metadataSettings: true,
            },
          },
        },
      }),
      prisma.adminSettings.findFirst(),
    ]);
    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    const storageProvider = await getStorageProvider(adminSettings! as AdminSettings);
    const fileUrl = storageProvider.getFileUrl(file.url);
    const fileContent = await storageProvider.getFileContent(file.url);

    return NextResponse.json({ ...file, url: fileUrl, content: fileContent });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id;
  const session = await getSession(request);
  const userObj = session?.user as User;

  if (!userObj) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [file, adminSettings] = await Promise.all([
      prisma.file.findUnique({
        where: { id: fileId },
        include: { uploadedBy: true, settings: true },
      }),
      prisma.adminSettings.findFirst(),
    ]);

    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }

    if (file.uploadedBy.id !== userObj.id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const storageProvider = await getStorageProvider(adminSettings! as AdminSettings);
    await storageProvider.deleteFile(file.url);

    // Delete associated records in the appropriate order
    if (file.settings) {
      await prisma.uploadLimits.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await prisma.downloadSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await prisma.expirationSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await prisma.versioningSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await prisma.metadataSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await prisma.fileSettings.delete({
        where: { id: file.settings.id },
      });
    }

    await prisma.comment.deleteMany({
      where: { fileId: fileId },
    });

    await prisma.fileReaction.deleteMany({
      where: { fileId: fileId },
    });

    await prisma.bookmark.deleteMany({
      where: { fileId: fileId },
    });

    await prisma.activity.deleteMany({
      where: {
        entityId: fileId,
        entityType: 'FILE',
      },
    });

    // Delete the file
    await prisma.file.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}