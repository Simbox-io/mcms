// components/Breadcrumbs.tsx
'use client';

import { Breadcrumb, BreadcrumbSeparator, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter((segment) => segment !== '');

  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/">Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        return (
          <BreadcrumbItem key={segment}>
            <BreadcrumbSeparator />
            {isLast ? (
              <span>{segment}</span>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={href}>{segment}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}