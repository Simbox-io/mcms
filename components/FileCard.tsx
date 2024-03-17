import React from 'react';
import { File, User, Project, Tag } from '@/lib/prisma';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

interface FileCardProps {
  file: File;
  onClick: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onClick }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center">
        <Avatar src={file.uploadedBy.avatar || ''} alt={file.uploadedBy.username} size="small" />
        <div className="ml-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{file.uploadedBy.username}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{file.name}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{file.description}</p>
      </div>
      {file.project && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Project: {file.project?.name || ''}</p>
        </div>
      )}
      <div className="mt-4 flex flex-wrap">
        {file.tags && file.tags?.map((tag) => (
          <Badge key={tag.id} variant="primary" className="mr-2 mb-2">
            {tag.name}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default FileCard;