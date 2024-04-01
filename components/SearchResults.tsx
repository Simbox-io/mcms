'use client';

import React from 'react';
import { SearchResult } from './SearchBar';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { FiFile, FiFolder, FiUsers, FiUser, FiFileText } from 'react-icons/fi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

interface SearchResultsProps {
  results: {
    posts: SearchResult[];
    files: SearchResult[];
    projects: SearchResult[];
    spaces: SearchResult[];
    profiles: SearchResult[];
  };
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
    ));
  };

  return (
    <div className="max-h-96 overflow-y-auto mt-14 w-full">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {renderResults(Object.values(results).flat())}
        </TabsContent>
        <TabsContent value="posts">
          {renderResults(results.posts)}
        </TabsContent>
        <TabsContent value="files">
          {renderResults(results.files)}
        </TabsContent>
        <TabsContent value="projects">
          {renderResults(results.projects)}
        </TabsContent>
        <TabsContent value="spaces">
          {renderResults(results.spaces)}
        </TabsContent>
        <TabsContent value="profiles">
          {renderResults(results.profiles)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults;
