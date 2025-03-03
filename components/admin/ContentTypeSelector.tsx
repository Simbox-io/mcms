'use client';
import React, { useState } from 'react';
import Button from '@/components/next-gen/Button';
import { FiPlus } from 'react-icons/fi';

interface ContentTypeSelectorProps {
  onSelect: (type: string) => void;
  existingTypes?: string[];
}

const sectionTypes = [
  { type: 'hero', name: 'Hero Section', icon: '🖼️', description: 'Large banner with heading, text and optional button' },
  { type: 'content', name: 'Content Block', icon: '📝', description: 'Rich text content area' },
  { type: 'gallery', name: 'Image Gallery', icon: '📷', description: 'Display multiple images in a grid or carousel' },
  { type: 'cta', name: 'Call to Action', icon: '📢', description: 'Prompt visitors to take action with a button' },
  { type: 'posts', name: 'Posts Grid', icon: '📰', description: 'Display recent posts or articles' },
  { type: 'projects', name: 'Projects Showcase', icon: '🏗️', description: 'Highlight projects in a grid layout' },
];

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ onSelect, existingTypes = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto"
      >
        <FiPlus className="mr-2" /> Add Section
      </Button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full md:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg p-4">
          <h3 className="text-lg font-medium mb-2">Add Page Section</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Select a section type to add to your page
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectionTypes.map(({ type, name, icon, description }) => (
              <button
                key={type}
                onClick={() => {
                  onSelect(type);
                  setIsOpen(false);
                }}
                className={`p-3 text-left rounded-lg transition-colors flex flex-col ${
                  existingTypes.includes(type) 
                    ? 'bg-gray-100 dark:bg-gray-700 opacity-60 cursor-not-allowed' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                disabled={existingTypes.includes(type) && ['hero'].includes(type)}
              >
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-right">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTypeSelector;
