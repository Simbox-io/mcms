// app/files/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';
import { formatDate } from '../../utils/dateUtils';
import { getImageUrl } from '../../utils/imageUtils';

interface File {
  id: number;
  name: string;
  url: string;
  thumbnail: string;
  size: number;
  createdAt: string;
}

const FileListPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/files?page=${currentPage}`);

        if (response.ok) {
          const data = await response.json();
          setFiles(data.files);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching files:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpload = () => {
    router.push('/files/upload');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Files</h1>
        <Button variant="primary" onClick={handleUpload}>
          Upload File
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {files.map((file) => (
              <Card key={file.id}>
                <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800">
                  <img
                    src={getImageUrl(file.thumbnail)}
                    alt={file.name}
                    className="max-w-full max-h-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {file.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Size: {formatFileSize(file.size)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Uploaded on {formatDate(file.createdAt)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FileListPage;

// Helper function to format file size
function formatFileSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize?.toFixed(2)} ${units[unitIndex]}`;
}