// components/icons/AIIcon.tsx
import React from 'react';
const AIIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5M21 11.5a8.5 8.5 0 0 0-8.5-8.5M21 11.5H3M12 20v-8.5" />
    </svg>
  );
};
export default AIIcon;