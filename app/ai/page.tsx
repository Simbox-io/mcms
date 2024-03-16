// pages/AIFeaturesDemo.tsx
import React, { useState } from 'react';
import AISearch from '@/components/AI/AISearch';
import SuggestedTags from '@/components/AI/SuggestedTags';
import AIWritingAssistant from '@/components/AI/AIWritingAssistant';
import ContentModerationAlert from '@/components/AI/ContentModerationAlert';
import Tag from '@/components/AI/Tag';

const AIFeaturesDemo: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const sampleSearchResults = [
    {
      id: '1',
      title: 'Introduction to AI',
      description: 'Learn the basics of artificial intelligence and its applications.',
      author: {
        id: '1',
        name: 'John Doe',
        avatar: '/images/avatar1.jpg',
      },
      tags: ['AI', 'Machine Learning', 'Deep Learning'],
      url: '/blog/introduction-to-ai',
    },
    {
      id: '2',
      title: 'Building Chatbots with Natural Language Processing',
      description: 'Discover how to build intelligent chatbots using NLP techniques.',
      author: {
        id: '2',
        name: 'Jane Smith',
        avatar: '/images/avatar2.jpg',
      },
      tags: ['NLP', 'Chatbots', 'Conversational AI'],
      url: '/blog/building-chatbots-with-nlp',
    },
    // Add more sample search results...
  ];
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prevTags) => [...prevTags, tag]);
  };
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI Features Demo</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">AI-Powered Search</h2>
        <AISearch />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Suggested Tags</h2>
        <SuggestedTags
          content={content}
          onTagSelect={handleTagSelect}
        />
        <div className="mt-4">
          <p>Selected Tags:</p>
          <div className="flex flex-wrap">
            {selectedTags.map((tag) => (
              <Tag key={tag} label={tag} className="mr-2 mb-2" />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">AI Writing Assistant</h2>
        <AIWritingAssistant />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Content Moderation</h2>
        <textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Enter your content here..."
          className="w-full h-40 border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ContentModerationAlert content={content} />
      </div>
    </div>
  );
};
export default AIFeaturesDemo;