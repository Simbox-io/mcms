import React from 'react';
import Button from './Button';
import { format } from 'date-fns';

interface NotificationProps {
  id: number;
  userId: number;
  message: string;
  link?: string;
  createdAt: Date;
  read: boolean;
  onMarkAsRead: (notificationId: number) => void;
  onDelete: (notificationId: number) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  message,
  link,
  createdAt,
  read,
  onMarkAsRead,
  onDelete,
}) => {
  const handleMarkAsRead = () => {
    onMarkAsRead(id);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 mb-4 ${read ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:underline mt-1"
            >
              View Details
            </a>
          )}
        </div>
        {!read && (
          <Button variant="secondary" size="small" onClick={handleMarkAsRead}>
            Mark as Read
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {format(createdAt, 'MMM d, yyyy h:mm a')}
        </p>
        <Button variant="danger" size="small" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default Notification;