// app/search/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import { useToken } from '../../lib/useToken';

interface SearchResult {
  id: number;
  title: string;
  type: 'post' | 'file' | 'project';
}

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const token = useToken();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchTerm)}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error searching:', response.statusText);
        }
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchTerm.trim() !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      setTotalPages(1);
      setIsLoading(false);
    }
  }, [searchTerm, currentPage, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
        Search Results for "{searchTerm}"
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : searchResults.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((result) => (
              <Card key={result.id}>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {result.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{result.type}</p>
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
      ) : (
        <p className="text-gray-600 dark:text-gray-400">No results found.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;