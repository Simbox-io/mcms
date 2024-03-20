'use client';
import React, { useState } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Enter tags...',
  className = '',
  id,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div id={id} className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 flex flex-wrap ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="bg-blue-500 text-white rounded-md px-2 py-1 text-sm mr-2 mb-2 flex items-center"
        >
          {tag}
          <button
            type="button"
            className="ml-1 focus:outline-none"
            onClick={() => handleTagRemove(tag)}
          >
            &times;
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder}
        className="flex-grow focus:outline-none bg-transparent text-gray-800 dark:text-gray-200 px-2 py-1"
      />
    </div>
  );
};

export default TagInput;