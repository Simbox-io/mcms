import React from 'react';
import { File, User, Project, Tag } from '@/lib/prisma';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

interface FileCardProps {
  file: File;
  onClick: () => void;
  uploadedBy: User;
  project?: Project;
  tags: Tag[];
}

const FileCard: React.FC<FileCardProps> = ({ file, onClick, uploadedBy, project, tags }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center">
        <Avatar src={uploadedBy.avatar || ''} alt={uploadedBy.username} size="small" />
        <div className="ml-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{uploadedBy.username}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{file.name}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{file.description}</p>
      </div>
      {project && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Project: {project.name}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="primary" className="mr-2 mb-2">
            {tag.name}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default FileCard;