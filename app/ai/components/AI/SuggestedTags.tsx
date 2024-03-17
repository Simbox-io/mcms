import React from 'react';

interface SuggestedTagsProps {
  content: string;
  onTagSelect: (tag: string) => void;
}

const SuggestedTags: React.FC<SuggestedTagsProps> = ({ content, onTagSelect }) => {
  return <div>Suggested Tags Component</div>;
};

export default SuggestedTags;
