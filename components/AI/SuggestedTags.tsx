// components/SuggestedTags.tsx
import React, { useState, useEffect } from 'react';
import Tag from './Tag';
interface SuggestedTagsProps {
  content: string;
  onTagSelect: (tag: string) => void;
}
const SuggestedTags: React.FC<SuggestedTagsProps> = ({ content, onTagSelect }) => {
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  useEffect(() => {
    const fetchSuggestedTags = async () => {
      // Make API call to get suggested tags based on content
      const response = await fetch('/api/suggestTags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      setSuggestedTags(data.tags);
    };
    fetchSuggestedTags();
  }, [content]);
  return (
    <div className="suggested-tags bg-gray-100 rounded-lg p-4">
      <h3 className="suggested-tags-title text-lg font-semibold mb-2">Suggested Tags</h3>
      <div className="tag-list flex flex-wrap">
        {suggestedTags.map((tag) => (
          <Tag
            key={tag}
            label={tag}
            onClick={() => onTagSelect(tag)}
            className="tag-item bg-white text-gray-800 rounded-full px-3 py-1 mr-2 mb-2 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-200"
          />
        ))}
      </div>
    </div>
  );
};
export default SuggestedTags;