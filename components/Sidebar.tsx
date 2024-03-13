// components/Sidebar.tsx
import React from 'react';
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
  return (
    <div className="w-64 bg-white dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700">
      <nav className="py-8">
        <ul className="space-y-2">
          {items.map((item) => (
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
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;