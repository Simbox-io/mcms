// components/Header.tsx
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NavigationMenu from './NavigationMenu';
import { User } from '@prisma/client';

const Header: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchTerm, setSerachTerm] = useState('');
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
  }

  (session);

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/logo.png" alt="MCMS" className="h-16 w-16" />
            <div className="flex-shrink-0">
              <Link href="/">

                <div>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MCMS</span>
                </div>
              </Link>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-4">
              {/* Desktop navigation links */}
              <Link href="/home">
                <span className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </span>
              </Link>
              <Link href="/files">
                <span className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                  Files
                </span>
              </Link>
              <Link href="/projects">
                <span className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                  Projects
                </span>
              </Link>
              <Link href="/wikis">
                <span className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium">
                  Wikis
                </span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            {/*<form onSubmit={handleSearch} className="mr-4">
              <div className="flex items-center">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-48"
                />
                <Button type="submit" variant="primary" className="ml-2">
                  Search
                </Button>
              </div>
            </form>*/}
            {/* User-related actions */}
            {status === 'loading' ? (
              <span>Loading...</span>
            ) : session ? (
              <>
                <Link href="/profile">
                  <span className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium mr-4">
                    {user?.username}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
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
            {/* Navigation menu */}
            <div className="ml-4 md:hidden">
              <NavigationMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;