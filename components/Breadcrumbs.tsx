// components/Breadcrumbs.tsx
import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  style?: React.CSSProperties;
  separator?: React.ReactNode;
  activeClassName?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  style,
  separator = '/',
  activeClassName = 'text-gray-500',
}) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb" style={style}>
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center">
            {index > 0 && (
              <span className="text-gray-500 mx-2">{separator}</span>
            )}
            {index === items.length - 1 ? (
              <span className={`text-sm font-medium ${activeClassName}`}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href}>
                <a className="text-sm font-medium text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  {item.label}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;