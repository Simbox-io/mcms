// components/Tag.tsx
import React from 'react';
interface TagProps {
  label: string;
  onClick?: () => void;
  className?: string;
}
const Tag: React.FC<TagProps> = ({ label, onClick, className }) => {
  return (
    <span
      className={`inline-block bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer hover:bg-gray-300 ${className}`}
      onClick={onClick}
    >
      {label}
    </span>
  );
};
export default Tag;