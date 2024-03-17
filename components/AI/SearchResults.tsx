// components/SearchResults.tsx
import React from 'react';
import Card from '../Card';
import Avatar from '../Avatar';
import Badge from '../Badge';
interface SearchResult {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  url: string;
}
interface SearchResultsProps {
  results: SearchResult[];
}
const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  return (
    <div className="search-results space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <Avatar src={result.author.avatar} alt={result.author.name} size="small" />
            <span className="ml-2 font-semibold">{result.author.name}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            <a href={result.url} className="text-blue-500 hover:underline">
              {result.title}
            </a>
          </h3>
          <p className="text-gray-600 mb-4">{result.description}</p>
          <div className="flex flex-wrap">
            {result.tags.map((tag) => (
              <Badge key={tag} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
export default SearchResults;