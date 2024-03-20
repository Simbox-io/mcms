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
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onResultClick }) => {
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

    const renderResults = (items: SearchResult[]) => {
        if (items?.length === 0 || !items ) {
            return (
                <div className="px-4 py-2">
                    <p className="text-lg text-center text-gray-500 dark:text-gray-400">No results found.</p>
                </div>
            );
        }

        return items?.map((result) => (
            <div
                key={result.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 h-16"
                onClick={() => onResultClick(result)}
            >
                <div className="flex justify-between">
                    <div className='flex flex-col space-y-2'>
                        <div className='flex items-center'>
                            {result.image && <Avatar src={result.image} size="small" className="mr-4" />}
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.title}</p>
                            </div>
                            {result.content && (
                                <p
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    dangerouslySetInnerHTML={{
                                        __html: result.content.slice(0, 120) + (result.content.length > 120 ? '...' : ''),
                                    }}
                                />
                            )}
                    </div>
                    {result.author && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {result.author}
                        </p>
                    )}
                </div>
            </div>
        ));
    };

    const tabs = [
        { id: 'posts', label: 'Posts', icon: renderIcon('Posts'), content: renderResults(results?.posts), count: results?.posts?.length },
        { id: 'files', label: 'Files', icon: renderIcon('Files'), content: renderResults(results?.files), count: results?.files?.length },
        { id: 'projects', label: 'Projects', icon: renderIcon('Projects'), content: renderResults(results?.projects), count: results?.projects?.length },
        { id: 'spaces', label: 'Spaces', icon: renderIcon('Spaces'), content: renderResults(results?.spaces), count: results?.spaces?.length },
        { id: 'tutorials', label: 'Tutorials', icon: renderIcon('Tutorials'), content: renderResults(results?.tutorials), count: results?.tutorials?.length },
        { id: 'users', label: 'Users', icon: renderIcon('Users'), content: renderResults(results?.users), count: results?.users?.length },
    ];

    return (
        <div className="bg-white w-full dark:bg-gray-900 shadow-md rounded-md overflow-hidden">
            <Tabs tabs={tabs} className="h-[512px] overflow-y-auto" />
        </div>
    );
};

export default SearchResults;