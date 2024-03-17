// components/Sidebar.tsx
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  link?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItem: string;
  onItemClick: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, activeItem, onItemClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        setShowLeftIndicator(scrollContainer.scrollLeft > 0);
        setShowRightIndicator(
            scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth
        );
      };

      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollToStart = () => {
    scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  };

  const scrollToEnd = () => {
    scrollContainerRef.current?.scrollTo({
      left: scrollContainerRef.current.scrollWidth,
      behavior: 'smooth',
    });
  };

  const renderSidebarItem = (item: SidebarItem) => (
      <li key={item.id}>
        {item.link ? (
            <Link
                href={item.link}
                className={`flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    activeItem === item.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
        ) : (
            <button
                onClick={() => onItemClick(item.id)}
                className={`flex items-center w-full px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    activeItem === item.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
        )}
      </li>
  );

  return (
      <>
        <div className="hidden md:block w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <nav className="py-8">
            <ul className="space-y-2">{items.map(renderSidebarItem)}</ul>
          </nav>
        </div>
        <div className="md:hidden relative">
          {showLeftIndicator && (
              <button
                  className="absolute left-0 top-0 bottom-0 z-10 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 focus:outline-none"
                  onClick={scrollToStart}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
          )}
          <div
              ref={scrollContainerRef}
              className="overflow-x-auto whitespace-nowrap bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <ul className="flex space-x-4 px-4 py-2">
              {items.map((item) => (
                  <li key={item.id}>
                    {item.link ? (
                        <Link
                            href={item.link}
                            className={`inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                activeItem === item.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                            }`}
                        >
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.label}
                        </Link>
                    ) : (
                        <button
                            onClick={() => onItemClick(item.id)}
                            className={`inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                activeItem === item.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                            }`}
                        >
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.label}
                        </button>
                    )}
                  </li>
              ))}
            </ul>
          </div>
          {showRightIndicator && (
              <button
                  className="absolute right-0 top-0 bottom-0 z-10 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 focus:outline-none"
                  onClick={scrollToEnd}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
          )}
        </div>
      </>
  );
};

export default Sidebar;