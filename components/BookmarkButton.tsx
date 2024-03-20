// components/BookmarkButton.tsx
import React, { useState } from 'react';
import BookmarkIcon from '@/components/icons/BookmarkIcon';

interface BookmarkButtonProps {
  itemId: string;
  itemType: string;
  onBookmark: (itemId: string, itemType: string) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ itemId, itemType, onBookmark }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(itemId, itemType);
  };

  return (
    <button
      className={`flex items-center ${
        isBookmarked ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
      } hover:text-blue-500 dark:hover:text-blue-400`}
      onClick={handleBookmark}
    >
      <BookmarkIcon className="w-5 h-5 mr-1" />
    </button>
  );
};

export default BookmarkButton;