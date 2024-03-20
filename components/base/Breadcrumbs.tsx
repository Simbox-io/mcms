import React from 'react';
import Link from 'next/link';
import ChevronRightSVG from '../icons/ChevronRight';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  separatorClassName?: string;
  separator?: React.ReactNode;
  renderItem?: (item: BreadcrumbItem, isLast: boolean) => React.ReactNode;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  separatorClassName = '',
  separator = <ChevronRightSVG className="w-4 h-4 text-gray-400" />,
  renderItem,
}) => {
  const lastIndex = items.length - 1;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {renderItem ? (
              renderItem(item, index === lastIndex)
            ) : (
              <>
                {index === lastIndex ? (
                  <span
                    className={`text-gray-500 ${activeItemClassName}`}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href}>
                    <a className={`text-blue-500 hover:underline ${itemClassName}`}>
                      {item.label}
                    </a>
                  </Link>
                )}
              </>
            )}
            {index !== lastIndex && (
              <span className={`mx-2 text-gray-500 ${separatorClassName}`}>{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;