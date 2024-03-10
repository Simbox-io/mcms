// app/notifications/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/dateUtils';
import { useToken } from '../../lib/useToken';

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  read: boolean;
}

const NotificationListPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const token = useToken();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session && token) {
      fetchNotifications();
    }
  }, [currentPage, session, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId ? { ...notification, read: true } : notification
          )
        );
      } else {
        console.error('Error marking notification as read:', response.statusText);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <div className="flex justify-between items-center">
              <p
                className={`text-gray-600 dark:text-gray-400 ${
                  notification.read ? 'opacity-50' : ''
                }`}
              >
                {notification.message}
              </p>
              {!notification.read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="text-blue-500 hover:underline"
                >
                  Mark as Read
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(notification.createdAt)}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NotificationListPage;