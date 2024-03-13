'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/prisma';
import Dropdown from './Dropdown';
import Button from './Button';

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLElement>(null);
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

  const handleClickOutside = (event: MouseEvent) => {
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
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="MCMS" className="h-16 w-16" />
            <Link href="/">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MCMS</span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-6">
              <Button
                variant="dropdown"
                size="medium"
                onClick={() => router.push('/home')}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 rounded-md text-sm font-medium flex items-center"
              >
                Home
              </Button>
              <Dropdown
                label="Files"
                options={['All Files', 'Shared with Me', 'Recent']}
                value=""
                onChange={(value) => router.push(`/files/${value.toLowerCase().replace(' ', '-')}`)}
                className="ml-4"
                buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-2 py-2 rounded-md text-sm font-medium flex items-center"
                menuClassName="mt-8"
              />
              <Dropdown
                label="Projects"
                options={['Project 1', 'Project 2', 'Project 3']}
                value=""
                onChange={(value) => router.push(`/projects/${value.toLowerCase().replace(' ', '-')}`)}
                className="ml-4"
                buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-2 py-2 rounded-md text-sm font-medium flex items-center"
                menuClassName="mt-8"
              />
              <Dropdown
                label="Wikis"
                options={['Wiki 1', 'Wiki 2', 'Wiki 3']}
                value=""
                onChange={(value) => router.push(`/wikis/${value.toLowerCase().replace(' ', '-')}`)}
                className="ml-4"
                buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-2 py-2 rounded-md text-sm font-medium flex items-center"
                menuClassName="mt-8"
              />
            </nav>
          </div>
          <div className="flex items-center">
          <button
              className="xl:hidden text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 focus:outline-none"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
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
          <div className="hidden xl:block">
              <form onSubmit={handleSearch} className="mr-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-96 px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-700 dark:border-gray-700 dark:placeholder-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <Button type="submit" variant="primary" size="medium" className="ml-2 text-white">
                    Search
                  </Button>
                </div>
              </form>
            </div>
            {status === 'loading' ? (
              <span>Loading...</span>
            ) : session ? (
              <div className="relative">
                <Dropdown
                  label={user?.username || ''}
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
                  className="ml-4"
                  buttonClassName="z-1 text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  menuClassName="mt-8"
                />
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
            <button
              className="ml-4 md:hidden text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/home">
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
              buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-base font-medium"
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
              buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-base font-medium"
              menuClassName="mt-2 z-10"
            />
            <Dropdown
              label="Wikis"
              options={['Wiki 1', 'Wiki 2', 'Wiki 3']}
              value=""
              onChange={(value) => {
                router.push(`/wikis/${value.toLowerCase().replace(' ', '-')}`);
                setIsMenuOpen(false);
              }}
              className="block w-full"
              buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-base font-medium"
              menuClassName="mt-2 z-10"
            /> 
          </div>
        </div>
      )}
      {isSearchOpen && (
        <div ref={searchRef} className="px-4 py-2">
          <form onSubmit={handleSearch}>
            <div className="flex items-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-700 dark:border-gray-700 dark:placeholder-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <Button type="submit" variant="primary" size="medium" className="ml-2 text-white">
                Search
              </Button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Header;