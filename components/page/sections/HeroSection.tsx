'use client';
import React from 'react';
import Link from 'next/link';
import Button from '@/components/next-gen/Button';

interface HeroSectionProps {
  section: any;
}

const HeroSection: React.FC<HeroSectionProps> = ({ section }) => {
  const { content } = section;
  
  const backgroundStyle = content?.backgroundImage 
    ? { 
        backgroundImage: `url(${content.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } 
    : {};
  
  return (
    <div 
      className="relative py-20 px-4 md:px-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
      style={backgroundStyle}
    >
      {content?.backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {content?.heading && (
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${content?.backgroundImage ? 'text-white' : ''}`}>
            {content.heading}
          </h1>
        )}
        
        {content?.subheading && (
          <p className={`text-xl md:text-2xl mb-8 ${content?.backgroundImage ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
            {content.subheading}
          </p>
        )}
        
        {content?.hasButton && content?.buttonText && content?.buttonUrl && (
          <Link href={content.buttonUrl}>
            <Button variant="primary" size="lg">
              {content.buttonText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
