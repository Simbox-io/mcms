'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiMenu, FiX } from 'react-icons/fi';

interface NavigationItem {
  id: string;
  title: string;
  url?: string;
  icon?: string;
  order: number;
  openInNewTab: boolean;
  requiresAuth: boolean;
  requiredRole?: string;
  isEnabled: boolean;
}

const DefaultNavbar = () => {
  const { data: session } = useSession();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const response = await fetch('/api/navigation?location=header');
        if (response.ok) {
          const data = await response.json();
          setNavItems(data.filter((item: NavigationItem) => item.isEnabled));
        } else {
          console.error('Failed to fetch navigation items');
        }
      } catch (error) {
        console.error('Error fetching navigation items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const shouldShowItem = (item: NavigationItem) => {
    if (!item.isEnabled) return false;
    if (item.requiresAuth && !session) return false;
    if (item.requiredRole && session?.user?.role !== item.requiredRole) return false;
    return true;
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                MCMS
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.filter(shouldShowItem).map((item) => (
                <Link
                  key={item.id}
                  href={item.url || '#'}
                  target={item.openInNewTab ? '_blank' : '_self'}
                  className="border-transparent text-gray-500 hover:border-blue-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {!session ? (
              <Link
                href="/login"
                className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </Link>
            ) : (
              <Link
                href="/account"
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              >
                <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                  {session.user?.name?.[0] || 'U'}
                </span>
                <span>{session.user?.name || 'User'}</span>
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.filter(shouldShowItem).map((item) => (
            <Link
              key={item.id}
              href={item.url || '#'}
              target={item.openInNewTab ? '_blank' : '_self'}
              className="border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.title}
            </Link>
          ))}
          {!session ? (
            <Link
              href="/login"
              className="border-transparent text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
          ) : (
            <Link
              href="/account"
              className="border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              My Account
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DefaultNavbar;
