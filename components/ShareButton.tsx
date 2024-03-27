// components/ShareButton.tsx
import React from 'react';
import ShareIcon from '@/components/icons/ShareIcon';

interface ShareButtonProps {
  itemId: string;
  itemType: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ itemId, itemType }) => {
  const handleShare = () => {
    // Implement the share functionality here
    console.log(`Sharing ${itemType} with ID ${itemId}`);
  };

  return (
    <button
      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      onClick={handleShare}
    >
      <ShareIcon className="w-5 h-5 mr-1" />
    </button>
  );
};

export default ShareButton;