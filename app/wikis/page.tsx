// app/wikis/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';
import { formatDate } from '../../utils/dateUtils';

interface Wiki {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
  };
  project: {
    id: number;
    name: string;
  };
}

const WikiListPage: React.FC = () => {
  const [wikis, setWikis] = useState<Wiki[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchWikis = async () => {
      try {
        const response = await fetch(`/api/wikis?page=${currentPage}`);

        if (response.ok) {
          const data = await response.json();
          setWikis(data.wikis);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching wikis:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching wikis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWikis();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateWiki = () => {
    router.push('/wikis/create');
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
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Wikis</h1>
        <Button variant="primary" onClick={handleCreateWiki}>
          Create Wiki
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wikis.map((wiki) => (
              <Card key={wiki.id}>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {wiki.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {wiki.content.slice(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Written by {wiki.author.username}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(wiki.createdAt)}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Project: {wiki.project.name}
                    </p>
                  </div>
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

export default WikiListPage;