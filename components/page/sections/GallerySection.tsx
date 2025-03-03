'use client';
import React from 'react';
import Image from 'next/image';

interface GallerySectionProps {
  section: any;
}

const GallerySection: React.FC<GallerySectionProps> = ({ section }) => {
  const { content } = section;
  const images = content?.images || [];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {content?.title && (
        <h2 className="text-2xl font-bold mb-4 text-center">{content.title}</h2>
      )}
      
      {content?.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-3xl mx-auto">
          {content.description}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((imageUrl: string, index: number) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative aspect-[4/3]">
              <Image
                src={imageUrl}
                alt={`Gallery image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GallerySection;
