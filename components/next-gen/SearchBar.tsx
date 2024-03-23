'use client'
import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  clearOnSearch?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
  clearOnSearch = false,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
    if (clearOnSearch) {
      setQuery('');
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        {query && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
            onClick={handleClear}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="absolute top-0 right-0 bottom-0 px-4 py-2 text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-800"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;