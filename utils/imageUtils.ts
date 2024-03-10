// utils/imageUtils.ts

export function getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return '/placeholder-image.png'; // Replace with your placeholder image URL
    }
    return imageUrl;
  }