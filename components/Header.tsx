// components/Header.tsx
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/prisma';
import { useTheme } from 'next-themes';
import Dropdown from './Dropdown';
import Button from './Button';

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
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

  const toggleTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    setIsThemeDropdownOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="MCMS" className="h-16 w-16" />
            <Link href="/">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MCMS</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Button
                variant="dropdown"
                size="medium"
                onClick={() => router.push('/home')}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500"
              >
                Home
              </Button>
              <Dropdown
                label="Files"
                options={['All Files', 'Shared with Me', 'Recent']}
                value=""
                onChange={(value) => router.push(`/files/${value.toLowerCase().replace(' ', '-')}`)}
                className="ml-4"
                buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                menuClassName="mt-8"
              />
              <Dropdown
                label="Projects"
                options={['Project 1', 'Project 2', 'Project 3']}
                value=""
                onChange={(value) => router.push(`/projects/${value.toLowerCase().replace(' ', '-')}`)}
                className="ml-4"
                buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                menuClassName="mt-8"
              />
              <Dropdown
                label="Wikis"
                options={['Wiki 1', 'Wiki 2', 'Wiki 3']}
                value=""
                onChange={(value) => router.push(`/wikis/${value.toLowerCase().replace(' ', '-')}`)}
                className="ml-4"
                buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                menuClassName="mt-8"
              />
            </nav>
          </div>
          <div className="flex items-center">
            <form onSubmit={handleSearch} className="mr-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-48 px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-700 dark:border-gray-700 dark:placeholder-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <Button type="submit" variant="primary" size='medium' className="ml-2 text-white">
                  Search
                </Button>
              </div>
            </form>
            {status === 'loading' ? (
              <span>Loading...</span>
            ) : session ? (
              <div className='relative'>
                <Dropdown
                  label={user?.username || ''}
                  options={user?.role === 'ADMIN' ? ['Dashboard', 'Analytics', 'Reports', 'Profile', 'Theme', 'Settings', 'Admin', 'Logout'] : ['Dashboard', 'Analytics', 'Reports', 'Profile', 'Theme', 'Settings', 'Logout']}
                  value=""
                  onChange={(value) => {
                    if (value === 'Logout') {
                      handleLogout();
                    } else if (value === 'Theme') {
                      setIsThemeDropdownOpen(!isThemeDropdownOpen);
                    } else {
                      router.push(`/${value.toLowerCase()}`);
                    }
                  }}
                  className="ml-4"
                  buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  menuClassName="mt-8"
                />
                {isThemeDropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-200 dark:bg-gray-700 rounded-md shadow-lg z-10">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 w-full text-left"
                      onClick={() => toggleTheme('light')}
                    >
                      Light
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 w-full text-left"
                      onClick={() => toggleTheme('dark')}
                    >
                      Dark
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium mr-4">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;