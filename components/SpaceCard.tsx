import React from 'react';
import { Space, User, Project, Page, SpaceView } from '@/lib/prisma';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';

interface SpaceCardProps {
  space: Space;
  onClick: () => void;
  author: User;
  project?: Project;
  pages: Page[];
  views: SpaceView[];
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onClick, author, project, pages, views }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center">
        <Avatar src={author.avatar || ''} alt={author.username} size="small" />
        <div className="ml-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{author.username}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(space.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{space.name}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{space.description}</p>
      </div>
      {project && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Project: {project.name}</p>
        </div>
      )}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{pages.length}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{views.length}</span>
        </div>
      </div>
    </Card>
  );
};

export default SpaceCard;