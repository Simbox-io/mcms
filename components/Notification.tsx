import React from 'react';
import Button from './Button';

interface NotificationProps {
  id: number;
  userId: number;
  message: string;
  link: string;
  createdAt: Date;
  read: boolean;
  onMarkAsRead: (notificationId: number) => void;
  onSendEmailDigest: (userId: number) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  message,
  createdAt,
  read,
  onMarkAsRead,
  onSendEmailDigest,
  userId,
}) => {
  const handleMarkAsRead = () => {
    onMarkAsRead(id);
  };

  const handleSendEmailDigest = () => {
    onSendEmailDigest(userId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4">
      <div className="flex justify-between items-center">
        <p className={`text-gray-600 dark:text-gray-400 ${read ? 'opacity-50' : ''}`}>{message}</p>
        {!read && (
          <Button variant="secondary" size="small" onClick={handleMarkAsRead}>
            Mark as Read
          </Button>
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {createdAt.toLocaleString()}
      </p>
      <Button variant="secondary" size="small" onClick={handleSendEmailDigest} className="mt-4">
        Send Email Digest
      </Button>
    </div>
  );
};

export default Notification;