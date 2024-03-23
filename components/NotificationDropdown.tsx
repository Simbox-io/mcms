// components/NotificationDropdown.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { Notification } from '@/lib/prisma';
import { FiBell } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        } else {
          console.error('Error fetching notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
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

  return (
    <div className="relative">
      <button
        className="flex items-center focus:outline-none"
        onClick={toggleDropdown}
      >
        <FiBell className="text-2xl" />
        {notifications.filter((notification) => !notification.isRead).length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Notifications</h3>
            {notifications.length === 0 ? (
              <p>No notifications found.</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-2 rounded-md ${
                      notification.isRead ? 'bg-gray-100' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{notification.message}</span>
                      {!notification.isRead && (
                        <button
                          className="text-sm text-blue-500 hover:underline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt))} ago
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 bg-gray-100">
            <button className="text-sm text-blue-500 hover:underline">
              Notification Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;