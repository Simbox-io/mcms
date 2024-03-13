// components/Sidebar.tsx
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
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
      <Link
        href={`#${item.id}`}
        onClick={() => onItemClick(item.id)}
        className={`flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          activeItem === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
        }`}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        {item.label}
      </Link>
    </li>
  );

  return (
    <>
      <div className="hidden md:block w-64 bg-white dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700">
        <nav className="py-8">
          <ul className="space-y-2">{items.map(renderSidebarItem)}</ul>
        </nav>
      </div>
      <div className="md:hidden relative">
        {showLeftIndicator && (
          <button
            className="absolute left-0 top-0 bottom-0 z-10 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 focus:outline-none"
            onClick={scrollToStart}
          >
            &lt;
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto whitespace-nowrap bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <ul className="flex space-x-4 px-4 py-2">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`#${item.id}`}
                  onClick={() => onItemClick(item.id)}
                  className={`inline-block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    activeItem === item.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {showRightIndicator && (
          <button
            className="absolute right-0 top-0 bottom-0 z-10 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 focus:outline-none"
            onClick={scrollToEnd}
          >
            &gt;
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;