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
    const renderIcon = (category: string) => {
        switch (category) {
            case 'Posts':
                return <FiFileText className="mr-2 w-5 h-5 text-blue-500" />;
            case 'Files':
                return <FiFile className="mr-2 w-5 h-5 text-green-500" />;
            case 'Projects':
                return <FiFolder className="mr-2 w-5 h-5 text-yellow-500" />;
            case 'Spaces':
                return <FiUsers className="mr-2 w-5 h-5 text-purple-500" />;
            case 'Tutorials':
                return <FiBook className="mr-2 w-5 h-5 text-red-500" />;
            case 'Users':
                return <FiUser className="mr-2 w-5 h-5 text-orange-500" />;
            default:
                return null;
        }
    };

    const renderResults = (items: SearchResult[]) => {
        return items?.map((result) => (
            <div
                key={result.id}
                className="px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 h-16"
                onClick={() => onResultClick(result)}
            >
                <div className="flex justify-between">
                    <div className='flex flex-col space-y-2'>
                        <div className='flex items-center'>
                            {result.image && <Avatar ><AvatarImage src={result.image}/></Avatar>}
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{result.title}</p>
                            </div>
                            {result.content && (
                                <p
                                    className="text-xs text-zinc-500 dark:text-zinc-400"
                                    dangerouslySetInnerHTML={{
                                        __html: result.content.slice(0, 120) + (result.content.length > 120 ? '...' : ''),
                                    }}
                                />
                            )}
                    </div>
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
        <div className="bg-white dark:bg-zinc-800 shadow-md rounded-md overflow-y-hidden">
            <Tabs className="h-full md:h-[512px] w-full" defaultValue='posts'>
            <TabsList>
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                        {tab.icon}
                        <span>{tab.label}</span>
                        <span className='ml-1 text-sm text-zinc-500 dark:text-zinc-400'>{tab.count}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
                {tabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id}>
                        {tab.content}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default SearchResults;