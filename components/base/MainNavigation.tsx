'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  openInNewTab: boolean;
  requiresAuth: boolean;
  requiredRole?: string;
  isEnabled: boolean;
  location: string;
}

const MainNavigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchNavigationItems = async () => {
      try {
        // Use new site-navigation API endpoint with header location
        const response = await axios.get('/api/site-navigation?location=header');
        setNavigationItems(response.data);
      } catch (error) {
        console.error('Error fetching site navigation items:', error);
      }
    };

    fetchNavigationItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Filter out items that require authentication if user is not logged in
  // Also filter out items that require specific roles the user doesn't have
  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !session) return false;
    if (item.requiredRole && user?.role !== item.requiredRole) return false;
    return true;
  });

  return (
    <div className="relative">
      {/* Hamburger Menu Button - always visible */}
      <button
        className="flex items-center p-2 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label="Main menu"
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

      {/* Navigation Menu - visible when isMenuOpen is true */}
      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="main-menu"
        >
          <div className="py-1" role="none">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.openInNewTab ? '_blank' : '_self'}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && (
                    <span className="mr-2">{item.icon}</span>
                  )}
                  {item.title}
                </Link>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No navigation items found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainNavigation;
