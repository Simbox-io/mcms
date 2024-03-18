'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Notification } from '@/lib/prisma';
import Dropdown from './Dropdown';
import Button from './Button';
import SearchBar from "@/components/SearchBar";
import Skeleton from './Skeleton';

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const user = session?.user as User;

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleButtonClick = (setStateFunction: React.Dispatch<React.SetStateAction<boolean>>) => {
    setButtonClicked(true);
    setStateFunction((prevState) => !prevState);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (buttonClicked) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    setButtonClicked(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((notification: Notification) => !notification.isRead).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [buttonClicked]);

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
      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleClearNotifications = async (notifications: Notification[]) => {
    try {
      for (const notification of notifications) {
      await fetch(`/api/notifications/${notification.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isHidden: true }),
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, isHidden: true }))
      );
      setUnreadCount(0);
    }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow z-10">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className='flex'>
            <div className="flex flex-shrink space-x-1 items-center">
              <img src="/logo.png" alt="MCMS" className="h-16 w-16 sm:h-12 sm:w-12" />
              <Link href="/">
                <span className="hidden md:block mx-1 mr-4 text-xl font-bold text-blue-600 dark:text-blue-400">MCMS</span>
              </Link>
              <nav className="hidden md:ml-4 md:flex mx-1 space-x-1 xl:space-x-6">
                <Button
                  variant="dropdown"
                  size="medium"
                  onClick={() => router.push('/explore')}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 rounded-md text-sm font-medium flex items-center"
                >
                  Explore
                </Button>
                <Button
                  variant="dropdown"
                  size="medium"
                  onClick={() => router.push('/explore/posts')}
                  className="hidden ml-4 md:block text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 rounded-md text-sm font-medium flex items-center"
                >
                  News
                </Button>
                <Dropdown
                  label="Projects"
                  options={['All Projects', 'Trending', 'Recent', 'My Project 1']}
                  value=""
                  onChange={(value) => router.push(`/projects/${value.toLowerCase().replace(' ', '-')}`)}
                  className="ml-4"
                  buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-2 py-2 rounded-md text-sm font-medium flex items-center"
                  menuClassName="mt-2"
                />
                <Dropdown
                  label="Files"
                  options={['All Files', 'Shared with Me', 'Recent']}
                  value=""
                  onChange={(value) => router.push(`/files/${value.toLowerCase().replace(' ', '-')}`)}
                  className="ml-4"
                  buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-2 py-2 rounded-md text-sm font-medium flex items-center"
                  menuClassName="mt-2"
                />
                <Dropdown
                  label="Spaces"
                  options={['All', 'Recent', 'Space 1', 'Space 2']}
                  value=""
                  onChange={(value) => router.push(`/spaces/${value.toLowerCase().replace(' ', '-')}`)}
                  className="ml-4"
                  buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-2 py-2 rounded-md text-sm font-medium flex items-center"
                  menuClassName="mt-2"
                />
              </nav>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 focus:outline-none"
              onClick={() => handleButtonClick(setIsSearchOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <div className="hidden flex-grow lg:block md:w-48 xl:w-80">
              <SearchBar onSearch={() => handleSearch} value={searchTerm} onChange={setSearchTerm} />
            </div>
            {status === 'loading' ? (
              <Skeleton variant="rectangular" width='40' height='40' className="ml-4" />
            ) : session ? (
              <div className="relative flex items-center md:ml-4">
                <button
                  className="relative z-10 mx-3 text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-0 py-2 rounded-md text-sm font-medium flex items-left"
                  onClick={() => handleButtonClick(setIsNotificationsOpen)}
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div
                    ref={notificationsRef}
                    className="origin-top-right absolute right-0 mt-36 w-80 rounded-md shadow-xl bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      {notifications.length === 0 && (
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                          No notifications
                        </div>
                      )} 
                      <Button variant="outline-secondary" size="small" onClick={() => handleClearNotifications(notifications)} className='flex justify-end w-full hover:bg-white hover:dark:bg-gray-700 dark:text-gray-100 border-none focus:ring-0 dark:focus:ring-0'>
                              Mark all as read
                        </Button>
                      {notifications.length > 0 && (
                        notifications.map((notification) => (
                          notification.isHidden ? (null || false) : (
                          <div
                            key={notification.id}
                            className={`px-4 py-2 text-sm text-gray-700 dark:text-gray-200 ${(!notification.isRead && !notification.isHidden) &&
                              'bg-blue-50 dark:bg-blue-900'
                              }`}
                          >
                            
                            <div className="flex justify-between items-center">
                              <span>{notification.message}</span>
                              {!notification.isRead && (
                                <button
                                  className="ml-2 focus:outline-none"
                                  onClick={() =>
                                    markNotificationAsRead(notification.id)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                            {notification.link && (
                              <Link href={notification.link}>
                                <span className="block mt-1 text-xs text-blue-600 dark:text-blue-400">
                                  View
                                </span>
                              </Link>
                            )}
                          </div>
                        ))))}
                    </div>
                  </div>
                )}
                <Dropdown
                  label={user?.username || ''}
                  image={user?.avatar || ''}
                  options={
                    user?.role === 'ADMIN'
                      ? ['Dashboard', 'Analytics', 'Reports', 'Profile', 'Settings', 'Admin', 'Logout']
                      : ['Dashboard', 'Analytics', 'Reports', 'Profile', 'Settings', 'Logout']
                  }
                  value=""
                  onChange={(value) => {
                    if (value === 'Logout') {
                      handleLogout();
                    } else {
                      router.push(`/${value.toLowerCase()}`);
                    }
                  }}
                  className="ml-0 md:ml-1 "
                  buttonClassName="z-1 mx-1 text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 py-1 rounded-lg text-xs flex items-left"
                  menuClassName="mt-3"
                  arrowEnabled={false}
                />
              </div>

            ) : (
              <>
                <Link href="/login">
                  <span
                    className="text-white hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium mx-4 bg-gray-500">
                    Login
                  </span>
                </Link>
                <Link href="/register">
                  <span className="text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Register
                  </span>
                </Link>
              </>
            )}
            <button
              className="ml-4 md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 focus:outline-none"
              onClick={() => handleButtonClick(setIsMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 mr-2">
            <Link href="/explore">
              <span
                className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 block text-left px-3 py-2 rounded-md text-base font-medium text-right"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </span>
            </Link>
            <Dropdown
              label="Files"
              options={['All Files', 'Shared with Me', 'Recent']}
              value=""
              onChange={(value) => {
                router.push(`/files/${value.toLowerCase().replace(' ', '-')}`);
                setIsMenuOpen(false);
              }}
              className="block w-full"
              buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-base font-medium justify-end"
              menuClassName="mt-2 z-10"
            />
            <Dropdown
              label="Projects"
              options={['Project 1', 'Project 2', 'Project 3']}
              value=""
              onChange={(value) => {
                router.push(`/projects/${value.toLowerCase().replace(' ', '-')}`);
                setIsMenuOpen(false);
              }}
              className="block w-full"
              buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-base font-medium justify-end"
              menuClassName="mt-2 z-10"
            />
            <Dropdown
              label="Spaces"
              options={['All Spaces', 'Trending', 'Space 1']}
              value=""
              onChange={(value) => {
                router.push(`/spaces/${value.toLowerCase().replace(' ', '-')}`);
                setIsMenuOpen(false);
              }}
              className="block w-full"
              buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-base font-medium justify-end"
              menuClassName="mt-2 z-10"
            />
          </div>
        </div>
      )}
      {isSearchOpen && (
        <div ref={searchRef} className="px-4 py-2">
          <SearchBar onSearch={() => handleSearch} />
        </div>
      )}
    </header>
  );
};

export default Header;