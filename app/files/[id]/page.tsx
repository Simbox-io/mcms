'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import { File, User } from '@/lib/prisma';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CommentSection from '@/components/CommentSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import instance from '@/utils/api';
import Spinner from '@/components/base/Spinner';
import axios from 'axios';

const FileDetailPage: React.FC = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [viewed, setViewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user as User | undefined;
  const router = useRouter();

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await instance.get(`/api/files/${id}`);
        setFile(response.data);
        if (!viewed) {
          await instance.put(`/api/files/${id}/view`);
          setViewed(true);
        }
        
      } catch (error) {
        console.error('Error fetching file:', error);
      }
      setLoading(false);
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

  if(loading) {
    return <div className='flex h-full w-full justify-center align-middle'><Spinner /></div>;
  }

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{label: 'All Files', href:'/files/all-files'}, {label: file.name, href:''}]} className='mb-4'/>
      <Card className='mb-8' footer={<p>Views: {file.views}</p>}>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">{file.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Uploaded on {new Date(file.createdAt).toLocaleDateString()}
          <span> by {file.uploadedBy.username}</span>
        </p>
        <p className="mb-4">{file.description}</p>
        <div className="mt-6 space-x-4 justify-end flex">
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
      <CommentSection postType='files' contentId={file.id} />
    </div>
  );
};

export default FileDetailPage;