// components/NotificationList.tsx
import { Notification } from '@/lib/prisma';

type NotificationListProps = {
  notifications: Notification[];
};

export default function NotificationList({ notifications }: NotificationListProps) {
  if (notifications.length === 0) {
    return <p className="text-gray-600">No notifications found.</p>;
  }
  return (
    <ul className="space-y-4">
      {notifications.map((notification) => (
        <li key={notification.id} className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">{notification.message}</h3>
          <p className="text-gray-600 dark:text-gray-300">{notification.link}</p>
        </li>
      ))}
    </ul>
  );
}