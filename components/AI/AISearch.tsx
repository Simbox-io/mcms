// components/AISearch.tsx
import React, { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import SearchResults from './SearchResults';
import AIIcon from '../icons/AIIcon';
const AISearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = async () => {
    setIsLoading(true);
    // Make API call to AI-powered search endpoint
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    setResults(data);
    setIsLoading(false);
  };
  return (
    <div className="ai-search">
      <div className="search-input-container flex items-center bg-white rounded-lg shadow-md p-4">
        <AIIcon className="w-6 h-6 text-blue-500 mr-2" />
        <Input
          name="search"
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything..."
          className="search-input flex-grow mr-4 border-0 focus:ring-0"
        />
        <Button onClick={handleSearch} disabled={isLoading} className="search-button bg-blue-500 text-white px-4 py-2 rounded-lg">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      {results.length > 0 && (
        <div className="search-results mt-6">
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
};
export default AISearch;