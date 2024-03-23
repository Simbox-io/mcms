// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import cachedPrisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { User, AdminSettings, File } from '@/lib/prisma';
import { getStorageProvider } from '@/lib/file-storage';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const fileId = params.id;
  try {
    const [file, adminSettings] = await Promise.all([
      cachedPrisma.file.findUnique({
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
      cachedPrisma.adminSettings.findFirst(),
    ]);
    if (!file) {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
    const storageProvider = await getStorageProvider(adminSettings as unknown as AdminSettings);
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
      cachedPrisma.file.findUnique({
        where: { id: fileId },
        include: { uploadedBy: true, settings: true },
      }),
      cachedPrisma.adminSettings.findFirst(),
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
      await cachedPrisma.uploadLimits.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await cachedPrisma.downloadSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await cachedPrisma.expirationSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await cachedPrisma.versioningSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await cachedPrisma.metadataSettings.deleteMany({
        where: { fileSettingsId: file.settings.id },
      });

      await cachedPrisma.fileSettings.delete({
        where: { id: file.settings.id },
      });
    }

    await cachedPrisma.comment.deleteMany({
      where: { fileId: fileId },
    });

    await cachedPrisma.fileReaction.deleteMany({
      where: { fileId: fileId },
    });

    await cachedPrisma.bookmark.deleteMany({
      where: { fileId: fileId },
    });

    await cachedPrisma.activity.deleteMany({
      where: {
        entityId: fileId,
        entityType: 'FILE',
      },
    });

    // Delete the file
    await cachedPrisma.file.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}