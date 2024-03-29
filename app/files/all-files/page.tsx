// app/files/page.tsx
'use client';
import React, { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Pagination from '../../../components/Pagination';
import Spinner from '../../../components/Spinner';
import { formatDate } from '../../../utils/dateUtils';
import { AnimatePresence } from 'framer-motion';

interface File {
  id: number;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

const FileListPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
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

  const toggleView = () => {
    setView(view === 'grid' ? 'list' : 'grid');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            {view === 'grid' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {files.map((file) => (
                    <Card key={file.id} onClick={() => router.push(`/files/${file.id}`)}>
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
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-4">
                {files.map((file) => (
                  <Card key={file.id} onClick={() => router.push(`/files/${file.id}`)}>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{file.name}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded {formatDate(file.createdAt)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{formatFileSize(file.size)}</p>
                  </Card>
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
};

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

export default FileListPage;
