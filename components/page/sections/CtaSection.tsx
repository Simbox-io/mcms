'use client';
import React from 'react';
import Link from 'next/link';
import Button from '@/components/next-gen/Button';

interface CtaSectionProps {
  section: any;
}

const CtaSection: React.FC<CtaSectionProps> = ({ section }) => {
  const { content } = section;
  
  const backgroundColor = content?.backgroundColor || '#f3f4f6';
  
  return (
    <div 
      className="py-16 px-4 rounded-lg text-center"
      style={{ backgroundColor }}
    >
      <div className="max-w-3xl mx-auto">
        {content?.title && (
          <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
        )}
        
        {content?.description && (
          <p className="text-lg mb-8 opacity-80">
            {content.description}
          </p>
        )}
        
        {content?.buttonText && content?.buttonUrl && (
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

export default CtaSection;
