import React from 'react';
import { Project, User, Space } from '@/lib/prisma';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';

interface ProjectCardProps {
  key?: string;
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center">
        <Avatar src={project.owner.avatar || ''} alt={project.owner.username} size="small" />
        <div className="ml-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{project.owner.username}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{project.name}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{project.description}</p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{project.collaborators.length}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{project.spaces.length}</span>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;