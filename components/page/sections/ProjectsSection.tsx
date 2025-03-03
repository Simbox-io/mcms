'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/next-gen/Card';
import Spinner from '@/components/base/Spinner';

interface ProjectsSectionProps {
  section: any;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ section }) => {
  const { content } = section;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/projects', {
          params: {
            limit: content?.limit || 6,
            sortBy: content?.sortBy || 'createdAt',
            sortDirection: content?.sortDirection || 'desc',
            ...content?.filterBy
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [content]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {content?.title && (
        <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
      )}
      
      {content?.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {content.description}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Card key={project.id} className="h-full flex flex-col">
            {project.thumbnail && (
              <div className="relative aspect-[16/9]">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
            
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-2">
                <Link href={`/projects/${project.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {project.title}
                </Link>
              </h3>
              
              {project.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>
              )}
              
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {content?.showViewAllLink && content?.viewAllUrl && (
        <div className="text-center mt-8">
          <Link 
            href={content.viewAllUrl}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {content.viewAllText || 'View all projects'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
