// app/files/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Pagination from '../../../components/Pagination';
import Spinner from '../../../components/Spinner';
import { formatDate } from '../../../utils/dateUtils';
import { getImageUrl } from '../../../utils/imageUtils';
import FileCard from '@/components/FileCard';
import { File } from '@/lib/prisma';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import Input from '../../../components/Input';
import CategoryFilter from '@/components/CategoryFilter';
import { AnimatePresence } from 'framer-motion';

const FileListPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
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

  const toggleView = () => {
    setView(view === 'grid' ? 'list' : 'grid');
  };

  const handleChangeCategory = (category: string) => {
    console.log(category);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpload = () => {
    router.push('/files/upload');
  };

  const handleOpenFile = (file: File) => {
    router.push(`/files/${file.id}`);
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
        <div className="flex items-center space-x-4">
          <Button variant="primary" onClick={handleUpload}>
            <IoMdAdd />
          </Button>
          <Button variant="secondary" onClick={toggleView}>
            {view === 'grid' ? <FiList /> : <FiGrid />}
          </Button>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex justify-between">
          <div className="flex-grow mr-4 ">
            <Input
              name=''
              id=''
              type="text"
              placeholder="Filter projects..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className=""
            />
          </div>
          <CategoryFilter onSelect={handleChangeCategory} options={[{ label: 'test' }, { label: 'test2' }]} className=''/>
        </div>
      </div>
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
              <FileCard key={file.id} file={file} onClick={() => handleOpenFile(file)} />
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
        ) : (
          <div className="flex flex-col space-y-4">
            {files.map((file) => (
              <Card key={file.id} onClick={() => handleOpenFile(file)}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{file.name}</h2>
                  <div className="flex flex-col items-end space-x-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded {formatDate(file.createdAt.toString())}
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    by {file.uploadedBy.username}
                  </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{file.description}</p>
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
    </div>
      
  );
};

export default FileListPage;