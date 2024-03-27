// components/AIWritingAssistant.tsx
import React, { useState } from 'react';
import Textarea from '../Textarea';
import Button from '../Button';
import Spinner from '../Spinner';
import Tooltip from '../Tooltip';
const AIWritingAssistant: React.FC = () => {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleAnalyze = async () => {
    setIsLoading(true);
    // Make API call to get writing suggestions and corrections
    const response = await fetch('/api/analyzeWriting', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    const data = await response.json();
    setSuggestions(data.suggestions);
    setIsLoading(false);
  };
  const handleSuggestionClick = (suggestion: string) => {
    // Apply the clicked suggestion to the content
    setContent((prevContent) => prevContent + ' ' + suggestion);
  };
  return (
    <div className="ai-writing-assistant">
      <Textarea
        value={content}
        onChange={(e) => setContent(e)}
        placeholder="Start writing..."
        className="writing-input border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button onClick={handleAnalyze} disabled={isLoading} className="analyze-button bg-blue-500 text-white px-4 py-2 rounded-lg mb-4">
        {isLoading ? <Spinner size="small" /> : 'Analyze'}
      </Button>
      {suggestions.length > 0 && (
        <div className="suggestion-list bg-gray-100 rounded-lg p-4">
          <h3 className="suggestion-title text-lg font-semibold mb-2">Suggestions</h3>
          {suggestions.map((suggestion, index) => (
            <Tooltip key={index} content="Click to apply suggestion">
              <div
                className="suggestion-item bg-white text-gray-800 rounded-lg px-3 py-2 mb-2 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-200"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
};
export default AIWritingAssistant;