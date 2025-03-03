'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/next-gen/Button';
import Spinner from '@/components/base/Spinner';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  useEffect(() => {
    // This would typically fetch files data from an API
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setFiles([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading') {
    return <Spinner />;
  }

  if (!session || !(user?.role === 'ADMIN')) {
    return (
      <EmptyState
        title="Unauthorized"
        description="You don't have permission to access this page."
        action={
          <Button variant="primary" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        }
      />
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">File Manager</h1>
        <div className="space-x-2">
          <Button variant="primary">Upload Files</Button>
          <Button variant="secondary">Create Folder</Button>
        </div>
      </div>

      <EmptyState
        title="No Files Found"
        description="You haven't uploaded any files yet."
        action={
          <Button variant="primary">
            Upload Your First File
          </Button>
        }
      />
    </div>
  );
};

export default FilesPage;
