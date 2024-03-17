// components/FileGrid.tsx
import React from 'react';
import FileCard from '@/components/FileCard';
import { File } from '@/lib/prisma';

interface FileGridProps {
  files: File[];
}

const FileGrid: React.FC<FileGridProps> = ({ files }) => {
  const handleFileClick = (file: { id: string; name: string; url: string; createdAt: Date }) => {
    // Logic for handling file click (e.g., opening the file in a new tab or downloading it)
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} onClick={() => handleFileClick(file)} />
      ))}
    </div>
  );
};

export default FileGrid;