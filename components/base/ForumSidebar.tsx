'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  defaultActive?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  setOpen, 
  defaultActive = 'home' 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState(defaultActive);

  useEffect(() => {
    // Close sidebar on route change on mobile
    const handleRouteChange = () => {
      if (window.innerWidth < 1024) {
        setOpen(false);
      }
    };

    handleRouteChange();
  }, [pathname, setOpen]);

  const menuItems = [
    { id: 'home', label: 'Home', path: '/forum' },
    { id: 'topics', label: 'Topics', path: '/forum/topics' },
    { id: 'categories', label: 'Categories', path: '/forum/categories' },
    { id: 'popular', label: 'Popular', path: '/forum/popular' },
    { id: 'recent', label: 'Recent', path: '/forum/recent' },
    { id: 'bookmarks', label: 'Bookmarks', path: '/forum/bookmarks' }
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transform ${
          open ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 lg:flex-shrink-0`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Forum</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${
                  pathname === item.path
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/forum/new')}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Create New Topic
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
