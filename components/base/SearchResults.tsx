// components/SearchResults.tsx
import React from 'react';
import { SearchResult } from './SearchBar';
import Avatar from './Avatar';

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
        <div>
            {renderResults('Posts', results.posts)}
            {renderResults('Files', results.files)}
            {renderResults('Projects', results.projects)}
            {renderResults('Spaces', results.spaces)}
            {renderResults('Tutorials', results.tutorials)}
            {renderResults('Users', results.users)}
            {results.posts?.length === 0 &&
                results.files?.length === 0 &&
                results.projects?.length === 0 &&
                results.spaces?.length === 0 &&
                results.tutorials?.length === 0 &&
                results.users?.length === 0 && (
                    <div className="px-4 py-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No results found.</p>
                    </div>
                )}
        </div>
    );
};

export default SearchResults;