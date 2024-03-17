'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/prisma';
import Dropdown from './Dropdown';
import Button from './Button';
import SearchBar from "@/components/SearchBar";
import Skeleton from './Skeleton';
import { SearchResult } from "@/components/SearchBar";

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
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
      }
      setButtonClicked(false);
    };

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [buttonClicked]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow z-10">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className='flex'>
            <div className="flex flex-shrink space-x-2 items-center">
              <img src="/logo.png" alt="MCMS" className="h-16 w-16 sm:h-12 sm:w-12" />
              <Link href="/">
                <span className="hidden md:block mx-2 text-xl font-bold text-blue-600 dark:text-blue-400">MCMS</span>
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
                  options={['All Files', 'Trending', 'Shared with Me', 'Recent']}
                  value=""
                  onChange={(value) => router.push(`/files/${value.toLowerCase().replace(' ', '-')}`)}
                  className="ml-4"
                  buttonClassName="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-2 py-2 rounded-md text-sm font-medium flex items-center"
                  menuClassName="mt-2"
                />
                <Dropdown
                  label="Spaces"
                  options={['All', 'Trending', 'Recent', 'Wiki 1', 'Wiki 2']}
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
            <div className="hidden flex-grow lg:block w-full">
              <SearchBar onSearch={() => handleSearch} value={searchTerm} onChange={setSearchTerm} />
            </div>
            {status === 'loading' ? (
              <Skeleton variant="rectangular" width='40' height='40' className="ml-4" />
            ) : session ? (
              <div className="relative flex items-center">
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
                  className="ml-4 md:ml-1 "
                  buttonClassName="z-1 mx-2 text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-0 py-2 rounded-md text-sm font-medium flex items-left "
                  menuClassName="mt-8"
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
              label="Wikis"
              options={['Wiki 1', 'Wiki 2', 'Wiki 3']}
              value=""
              onChange={(value) => {
                router.push(`/wikis/${value.toLowerCase().replace(' ', '-')}`);
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