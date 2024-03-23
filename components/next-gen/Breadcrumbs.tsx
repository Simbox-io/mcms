'use client'
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid';
import { Transition } from '@headlessui/react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  homeLink?: string;
  homeLinkLabel?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  homeLink = '/',
  homeLinkLabel = 'Home',
}) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to={homeLink}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            {homeLinkLabel}
          </Link>
        </li>
        {items.map((item, index) => (
          <Transition
            key={item.href}
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <li className="inline-flex items-center">
              <ChevronRightIcon className="w-6 h-6 text-gray-400" />
              <Link
                to={item.href}
                className={`ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white ${
                  index === items.length - 1
                    ? 'text-gray-500 dark:text-gray-500 pointer-events-none'
                    : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          </Transition>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;