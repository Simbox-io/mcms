'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Notification } from '@/lib/prisma';
import Link from 'next/link';
import Skeleton from '@/components/Skeleton';

const NotificationsPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = session?.user as User;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (status === 'loading') {
    return <Skeleton variant="rectangular" width="100%" height="400px" />;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height="400px" />
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-200">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow ${
                notification.isRead ? 'bg-white dark:bg-gray-800' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">{notification.message}</span>
                <div className="flex space-x-2">
                  {!notification.isRead && (
                    <button
                      className="text-blue-500 hover:text-blue-600 focus:outline-none"
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    className="text-red-500 hover:text-red-600 focus:outline-none"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {notification.link && (
                <Link href={notification.link}>
                  <span className="text-blue-500 hover:text-blue-600">View Details</span>
                </Link>
              )}
              <p className="text-gray-500 text-sm mt-2">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;