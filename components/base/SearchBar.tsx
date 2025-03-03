// components/SearchBar.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import Skeleton from '@/components/base/Skeleton';
import SearchResults from '@/components/base/SearchResults';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export interface SearchResult {
  id: string;
  type: 'post' | 'project' | 'file' | 'space' | 'profile';
  title: string;
  content: string;
  author?: string;
  value: string;
  image?: string;
  url: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  className = '',
  placeholder = 'Search...',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<{
    posts: SearchResult[];
    files: SearchResult[];
    projects: SearchResult[];
    spaces: SearchResult[];
    tutorials: SearchResult[];
    users: SearchResult[];
  }>({
    posts: [],
    files: [],
    projects: [],
    spaces: [],
    tutorials: [],
    users: [],
  });

  const fetchSearchResults = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults({
        posts: [],
        files: [],
        projects: [],
        spaces: [],
        tutorials: [],
        users: [],
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      const data = response.data;

      // Transform the data into the SearchResult format
      const posts = data.posts.map((post: any) => ({
        id: post.id,
        type: 'post',
        title: post.title,
        content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
        author: post.author.username,
        value: post.title,
        image: post.author.avatar,
        url: `/explore/posts/${post.id}`,
      }));

      const files = data.files.map((file: any) => ({
        id: file.id,
        type: 'file',
        title: file.name,
        content: file.description || '',
        author: file.uploadedBy.username,
        value: file.name,
        image: file.uploadedBy.avatar,
        url: `/files/${file.id}`,
      }));

      const projects = data.projects.map((project: any) => ({
        id: project.id,
        type: 'project',
        title: project.name,
        content: project.description || '',
        author: project.owner.username,
        value: project.name,
        image: project.owner.avatar,
        url: `/projects/${project.id}`,
      }));

      const spaces = data.spaces.map((space: any) => ({
        id: space.id,
        type: 'space',
        title: space.title,
        content: space.description || '',
        author: space.owner.username,
        value: space.title,
        image: space.owner.avatar,
        url: `/spaces/${space.id}`,
      }));

      const tutorials = data.tutorials.map((tutorial: any) => ({
        id: tutorial.id,
        type: 'tutorial',
        title: tutorial.title,
        content: tutorial.description || '',
        author: tutorial.author.username,
        value: tutorial.title,
        image: tutorial.author.avatar,
        url: `/tutorials/${tutorial.id}`,
      }));

      const users = data.users.map((user: any) => ({
        id: user.id,
        type: 'profile',
        title: user.username,
        content: user.bio || '',
        author: '',
        value: user.username,
        image: user.avatar,
        url: `/profile/${user.username}`,
      }));

      setSearchResults({
        posts,
        files,
        projects,
        spaces,
        tutorials,
        users,
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
    }

    setIsLoading(false);
  };

  // Add debounced function for search
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      await fetchSearchResults(query);
    }, 300)
  ).current;

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
      setIsOpen(true);
    } else {
      setSearchResults({
        posts: [],
        files: [],
        projects: [],
        spaces: [],
        tutorials: [],
        users: [],
      });
      setIsOpen(false);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery('');
    setIsOpen(false);
    router.push(result.url);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      searchResultsRef.current &&
      !searchResultsRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeSection, setActiveSection] = useState('');
  const sections = ['posts', 'files', 'projects', 'spaces', 'tutorials', 'users'];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    // Get total number of items across all sections
    const totalItems = Object.values(searchResults).reduce(
      (acc, curr) => acc + curr.length,
      0
    );

    // Handle keyboard navigation
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (activeIndex < totalItems - 1) {
          setActiveIndex(activeIndex + 1);
          
          // Determine which section the active item is in
          let itemCount = 0;
          for (const section of sections) {
            if (activeIndex + 1 < itemCount + searchResults[section as keyof typeof searchResults].length) {
              setActiveSection(section);
              break;
            }
            itemCount += searchResults[section as keyof typeof searchResults].length;
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
          
          // Determine which section the active item is in
          let itemCount = 0;
          for (const section of sections) {
            if (activeIndex - 1 < itemCount + searchResults[section as keyof typeof searchResults].length) {
              setActiveSection(section);
              break;
            }
            itemCount += searchResults[section as keyof typeof searchResults].length;
          }
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          // Find the selected result
          let itemCount = 0;
          for (const section of sections) {
            const sectionResults = searchResults[section as keyof typeof searchResults];
            if (activeIndex < itemCount + sectionResults.length) {
              const result = sectionResults[activeIndex - itemCount];
              handleResultClick(result);
              break;
            }
            itemCount += sectionResults.length;
          }
        } else {
          // If no item is selected, search for the current query
          onSearch(searchQuery);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        ref={inputRef}
        className="w-full h-8 pl-10 pr-4 py-1 rounded-md border border-gray-300 bg-gray-100 dark:bg-gray-700 dark:placeholder:text-gray-300 dark:text-gray-100 text-gray-600 dark:bg-blend-darken focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={searchResultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute right-3 top-12 z-10 mt-2 w-full md:w-auto rounded-md shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {isLoading ? (
              <div className="px-4 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            ) : (
              <SearchResults results={searchResults} onResultClick={handleResultClick} activeIndex={activeIndex} activeSection={activeSection} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};

export default SearchBar;