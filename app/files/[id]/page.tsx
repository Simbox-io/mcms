'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { File, User } from '@/lib/prisma';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const FileDetailPage: React.FC = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const router = useRouter();

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

  const handleDeleteFile = async () => {
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/files/all-files');
      } else {
        console.error('Error deleting file:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  if (!file) {
    return <div>Loading...</div>;
  }

  const isTextFile = (contentType: string, fileName: string) => {
    const textTypes = ['text/', 'application/json', 'application/xml', 'application/rtf'];
    const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.css', '.html', '.htm', '.php', '.py', '.rb', '.java', '.cs', '.cpp', '.c', '.h', '.hpp', '.go', '.rs', '.swift', '.kt', '.kts', '.dart', '.sql', '.sh', '.bat', '.cmd', '.ps1', '.psm1', '.psd1', '.vim', '.conf', '.ini', '.yml', '.yaml', '.toml', '.md', '.markdown', '.txt'];

    if (textTypes.some(type => contentType.startsWith(type))) {
      return true;
    }

    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    if (codeExtensions.includes(extension)) {
      return true;
    }

    return false;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">{file.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Uploaded on {new Date(file.createdAt).toLocaleDateString()}
          <span> by {file.uploadedBy.username}</span>
        </p>
        <p className="mb-4">{file.description}</p>
        <div className="my-8 space-x-4 justify-end flex">
          <a href={file.url} target="_blank" rel="noopener noreferrer">
            <Button>Download</Button>
          </a>
          {file.uploadedById === user?.id && (
            <Button variant="danger" onClick={handleDeleteFile}>
              Delete
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FileDetailPage;