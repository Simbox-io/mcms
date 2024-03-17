import React from 'react';

interface TagProps {
  label: string;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ label, className }) => {
  return <span className={`inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 ${className}`}>{label}</span>;
};

export default Tag;
