// components/SearchResults.tsx
'use client';
import React from 'react';
import { SearchResult } from './SearchBar';
import Avatar from './Avatar';
import { FiFile, FiFolder, FiUsers, FiBook, FiUser, FiFileText } from 'react-icons/fi';
import Tabs from './Tabs';

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
    activeIndex?: number;
    activeSection?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
    results, 
    onResultClick, 
    activeIndex = -1,
    activeSection = ''
}) => {
    const renderIcon = (category: string) => {
        switch (category) {
            case 'Posts':
                return <FiFileText className="w-5 h-5 text-blue-500" />;
            case 'Files':
                return <FiFile className="w-5 h-5 text-green-500" />;
            case 'Projects':
                return <FiFolder className="w-5 h-5 text-yellow-500" />;
            case 'Spaces':
                return <FiUsers className="w-5 h-5 text-purple-500" />;
            case 'Tutorials':
                return <FiBook className="w-5 h-5 text-red-500" />;
            case 'Users':
                return <FiUser className="w-5 h-5 text-orange-500" />;
            default:
                return null;
        }
    };

    const renderResults = (items: SearchResult[], section: string, startIndex: number) => {
        if (items?.length === 0 || !items || !items.length || items === undefined || results === undefined || results === null) {
            return (
                <div className="px-4 py-2">
                    <p className="text-lg text-center text-gray-500 dark:text-gray-400">No results found.</p>
                </div>
            );
        }

        return items?.map((result, idx) => {
            const isActive = activeSection === section && activeIndex === startIndex + idx;
            
            return (
                <div
                    key={result.id}
                    className={`px-4 py-2 cursor-pointer ${isActive ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'} h-16 transition-colors duration-150`}
                    onClick={() => onResultClick(result)}
                >
                    <div className="flex justify-between">
                        <div className='flex flex-col space-y-2'>
                            <div className='flex items-center'>
                                {result.image && <Avatar src={result.image} size="small" className="mr-4" />}
                                <p className={`text-sm font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>{result.title}</p>
                            </div>
                            <p className="text-xs text-gray-500 truncate dark:text-gray-400">{result.content}</p>
                        </div>
                        {result.author && <span className="text-xs text-gray-400 dark:text-gray-500">{result.author}</span>}
                    </div>
                </div>
            );
        });
    };

    // Calculate start indices for each category
    const getStartIndex = (section: string) => {
        const sections = ['posts', 'files', 'projects', 'spaces', 'tutorials', 'users'];
        let startIndex = 0;
        
        for (const s of sections) {
            if (s === section) break;
            startIndex += results[s as keyof typeof results].length;
        }
        
        return startIndex;
    };

    const totalResults = Object.values(results).reduce((acc, curr) => acc + curr.length, 0);

    if (totalResults === 0) {
        return (
            <div className="px-4 py-8">
                <p className="text-center text-gray-500 dark:text-gray-400">No results found. Try a different search term.</p>
            </div>
        );
    }

    return (
        <div className="max-h-96 overflow-y-auto">
            {results.posts?.length > 0 && (
                <div>
                    <div className="sticky top-0 z-10 px-4 py-2 font-medium bg-gray-50 dark:bg-gray-800 flex items-center">
                        {renderIcon('Posts')}
                        <span className="ml-2">Posts</span>
                    </div>
                    {renderResults(results.posts, 'posts', getStartIndex('posts'))}
                </div>
            )}

            {results.files?.length > 0 && (
                <div>
                    <div className="sticky top-0 z-10 px-4 py-2 font-medium bg-gray-50 dark:bg-gray-800 flex items-center">
                        {renderIcon('Files')}
                        <span className="ml-2">Files</span>
                    </div>
                    {renderResults(results.files, 'files', getStartIndex('files'))}
                </div>
            )}

            {results.projects?.length > 0 && (
                <div>
                    <div className="sticky top-0 z-10 px-4 py-2 font-medium bg-gray-50 dark:bg-gray-800 flex items-center">
                        {renderIcon('Projects')}
                        <span className="ml-2">Projects</span>
                    </div>
                    {renderResults(results.projects, 'projects', getStartIndex('projects'))}
                </div>
            )}

            {results.spaces?.length > 0 && (
                <div>
                    <div className="sticky top-0 z-10 px-4 py-2 font-medium bg-gray-50 dark:bg-gray-800 flex items-center">
                        {renderIcon('Spaces')}
                        <span className="ml-2">Spaces</span>
                    </div>
                    {renderResults(results.spaces, 'spaces', getStartIndex('spaces'))}
                </div>
            )}

            {results.tutorials?.length > 0 && (
                <div>
                    <div className="sticky top-0 z-10 px-4 py-2 font-medium bg-gray-50 dark:bg-gray-800 flex items-center">
                        {renderIcon('Tutorials')}
                        <span className="ml-2">Tutorials</span>
                    </div>
                    {renderResults(results.tutorials, 'tutorials', getStartIndex('tutorials'))}
                </div>
            )}

            {results.users?.length > 0 && (
                <div>
                    <div className="sticky top-0 z-10 px-4 py-2 font-medium bg-gray-50 dark:bg-gray-800 flex items-center">
                        {renderIcon('Users')}
                        <span className="ml-2">Users</span>
                    </div>
                    {renderResults(results.users, 'users', getStartIndex('users'))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;