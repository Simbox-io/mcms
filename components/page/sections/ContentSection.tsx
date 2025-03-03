'use client';
import React from 'react';

interface ContentSectionProps {
  section: any;
}

const ContentSection: React.FC<ContentSectionProps> = ({ section }) => {
  const { content } = section;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content?.text || '' }}
      />
    </div>
  );
};

export default ContentSection;
