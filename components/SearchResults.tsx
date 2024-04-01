// components/SearchResults.tsx
'use client';
import React from 'react';
import { SearchResult } from './SearchBar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { FiFile, FiFolder, FiUsers, FiBook, FiUser, FiFileText } from 'react-icons/fi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';



interface SearchResultsProps {
  results: {
    posts: SearchResult[];
    files: SearchResult[];
    projects: SearchResult[];
    spaces: SearchResult[];
    tutorials: SearchResult[];
    users: SearchResult[];
  };
  onResultClick: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onResultClick }) => {
  const renderResults = (category: string, items: SearchResult[]) => {
    if (items?.length === 0) return null;

    return (
      <div key={category}>
        <h3 className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{category}</h3>
        {items?.map((result) => (
          <div
            key={result.id}
            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => onResultClick(result)}
          >
            <div className="flex items-center">
              {result.image && <Avatar src={result.image} size="small" className="mr-2" />}
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
        ))}
      </div>
    );
  };

  return (
    <div className="max-h-96 overflow-y-auto mt-14 w-full">
      {renderResults('Posts', results.posts)}
      {renderResults('Files', results.files)}
      {renderResults('Projects', results.projects)}
      {renderResults('Spaces', results.spaces)}
      {renderResults('Tutorials', results.tutorials)}
      {renderResults('Users', results.users)}
    </div>
  );
};

export default SearchResults;
