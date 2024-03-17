// lib/uploadImage.ts
import prisma from './prisma';

export async function uploadImage(file: File): Promise<string> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid image type. Only JPEG, PNG, and GIF are allowed.');
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  try {
    const existingImage = await prisma.image.findUnique({
      where: { fileName: file.name },
    });

    if (existingImage) {
      return existingImage.url;
    }

    const newImage = await prisma.image.create({
      data: {
        fileName: file.name,
        contentType: file.type,
        data: fileBuffer,
        url: `/api/images/${file.name}`,
      },
    });

    return `/api/images/${newImage.id}`;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image.');
  }
}