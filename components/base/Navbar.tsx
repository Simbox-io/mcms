'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/prisma';
import Button from './Button';
import Image from 'next/image';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const user = session?.user as User;
  const [siteTitle, setSiteTitle] = useState('MCMS');
  const [siteLogo, setSiteLogo] = useState('');
  
  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                className="p-2 rounded-md text-gray-400 lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                {sidebarOpen ? (
                  <span className="text-xl">✕</span>
                ) : (
                  <span className="text-xl">☰</span>
                )}
              </button>
              <Link href="/" className="flex items-center">
                {siteLogo ? (
                  <Image
                    src={siteLogo}
                    alt={siteTitle}
                    width={40}
                    height={40}
                    className="h-8 w-auto"
                  />
                ) : (
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{siteTitle}</span>
                )}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => router.push('/search')}
            >
              <span className="sr-only">Search</span>
              <span className="text-xl">🔍</span>
            </button>
            
            {status === 'authenticated' ? (
              <>
                <button
                  className="p-2 ml-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => router.push('/notifications')}
                >
                  <span className="sr-only">Notifications</span>
                  <span className="text-xl">🔔</span>
                </button>
                
                <div className="ml-3 relative">
                  <div>
                    <button
                      className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username || ''}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <span className="text-xl">👤</span>
                      )}
                    </button>
                  </div>
                  
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        href="/settings" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button onClick={() => router.push('/login')} variant="primary" size="small">
                  Sign in
                </Button>
                <Button onClick={() => router.push('/register')} variant="outline" size="small">
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
