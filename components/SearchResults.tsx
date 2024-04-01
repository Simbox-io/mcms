// components/SearchResults.tsx
'use client';
import React from 'react';
import { SearchResult } from './SearchBar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { FiFile, FiFolder, FiUsers, FiBook, FiUser, FiFileText } from 'react-icons/fi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onResultClick }) => {
  const renderResults = (items: SearchResult[]) => {
    if (items?.length === 0) return null;

    return items?.map((result) => (
      <div
        key={result.id}
        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => onResultClick(result)}
      >
        <div className="flex items-center">
          {result.image && (
            <Avatar className="mr-2">
              <AvatarImage src={result.image} alt={result.title} />
              <AvatarFallback>
                {result.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.title}</p>
            {result.content && (
              <p
                className="text-xs text-gray-500 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: result.content }}
              />
            )}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-h-96 overflow-y-auto mt-14 w-full">
      {renderResults(results)}
    </div>
  );
};

export default SearchResults;
