// lib/uploadImage.ts

import { createHash } from 'crypto';
import prisma from './prisma';

export async function uploadImage(file: File): Promise<string> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid image type. Only JPEG, PNG, and GIF are allowed.');
  }

  const fileBuffer = await file.arrayBuffer();
  const hash = createHash('sha256');
  hash.update(fileBuffer);
  const fileHash = hash.digest('hex');

  const fileName = `${fileHash}.${file.name.split('.').pop()}`;

  try {
    const existingImage = await prisma.image.findUnique({
      where: { fileName },
    });

    if (existingImage) {
      return existingImage.url;
    }

    const newImage = await prisma.image.create({
      data: {
        fileName,
        contentType: file.type,
        data: Buffer.from(fileBuffer),
      },
    });

    return `/api/images/${newImage.id}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
}