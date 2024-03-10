'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface File {
  id: number;
  name: string;
  url: string;
  createdAt: string;
}

const FileDetailPage: React.FC = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`/api/files/${id}`);

        if (response.ok) {
          const data = await response.json();
          setFile(data);
        } else {
          console.error('Error fetching file:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [id]);

  if (!file) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
          {file.name}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Uploaded on {new Date(file.createdAt).toLocaleDateString()}
        </p>
        <div className="mb-8">
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            <Button>Download</Button>
          </a>
        </div>
        <div>
          <Button variant="danger">Delete</Button>
        </div>
      </Card>
    </div>
  );
};

export default FileDetailPage;