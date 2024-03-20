// components/SubscribeButton.tsx
import React, { useState } from 'react';
import BellIcon from '@/components/icons/BellIcon';

interface SubscribeButtonProps {
  itemId: string;
  itemType: string;
  onSubscribe: (itemId: string, itemType: string) => void;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ itemId, itemType, onSubscribe }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    onSubscribe(itemId, itemType);
  };

  return (
    <button
      className={`flex items-center ${
        isSubscribed ? 'text-green-500' : 'text-gray-600 dark:text-gray-400'
      } hover:text-green-500 dark:hover:text-green-400`}
      onClick={handleSubscribe}
    >
      <BellIcon className="w-5 h-5 mr-1" />
    </button>
  );
};

export default SubscribeButton;