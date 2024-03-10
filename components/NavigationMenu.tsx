// components/NavigationMenu.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from './Button';

const NavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleMenu}
        className="text-gray-500 hover:text-gray-900 focus:outline-none"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10">
          <Link href="/home">
            <span
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                pathname === '/home' ? 'bg-gray-100' : ''
              }`}
            >
              Posts
            </span>
          </Link>
          <Link href="/files">
            <span
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                pathname === '/files' ? 'bg-gray-100' : ''
              }`}
            >
              Files
            </span>
          </Link>
          <Link href="/projects">
            <span
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                pathname === '/projects' ? 'bg-gray-100' : ''
              }`}
            >
              Projects
            </span>
          </Link>
          <Link href="/wikis">
            <span
              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                pathname === '/wikis' ? 'bg-gray-100' : ''
              }`}
            >
              Wikis
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavigationMenu;