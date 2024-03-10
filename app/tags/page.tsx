// app/tags/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../components/Card';
import Pagination from '../../components/Pagination';
import Spinner from '../../components/Spinner';

interface Tag {
  id: number;
  name: string;
  count: number;
}

const TagListPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`/api/tags?page=${currentPage}`);

        if (response.ok) {
          const data = await response.json();
          setTags(data.tags);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching tags:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTagClick = (tagId: number) => {
    router.push(`/tags/${tagId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Tags</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tags.map((tag) => (
              <Card key={tag.id} onClick={() => handleTagClick(tag.id)}>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{tag.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{tag.count} items</p>
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

export default TagListPage;