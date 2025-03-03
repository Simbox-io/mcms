'use client';
import React from 'react';
import HeroSection from './sections/HeroSection';
import ContentSection from './sections/ContentSection';
import GallerySection from './sections/GallerySection';
import CtaSection from './sections/CtaSection';
import PostsSection from './sections/PostsSection';
import ProjectsSection from './sections/ProjectsSection';

interface PageRendererProps {
  page: any;
}

const PageRenderer: React.FC<PageRendererProps> = ({ page }) => {
  if (!page) return null;

  return (
    <div className="page-container">
      {page.sections?.map((section: any) => (
        <div key={section.id} className="mb-8">
          {section.type === 'hero' && <HeroSection section={section} />}
          {section.type === 'content' && <ContentSection section={section} />}
          {section.type === 'gallery' && <GallerySection section={section} />}
          {section.type === 'cta' && <CtaSection section={section} />}
          {section.type === 'posts' && <PostsSection section={section} />}
          {section.type === 'projects' && <ProjectsSection section={section} />}
        </div>
      ))}
    </div>
  );
};

export default PageRenderer;
