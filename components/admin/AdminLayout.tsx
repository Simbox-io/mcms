'use client';
import React, { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  FiHome, FiFileText, FiUsers, FiSettings, FiBarChart2, 
  FiFolder, FiMessageSquare, FiPackage, FiGrid, FiLayers,
  FiMenu, FiPlusCircle, FiEdit3, FiList
} from 'react-icons/fi';
import Spinner from '@/components/base/Spinner';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/next-gen/Button';
import { User } from '@/lib/prisma';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title,
  description 
}) => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!session || !(user?.role === 'ADMIN')) {
    return (
      <EmptyState
        title="Unauthorized"
        description="You don't have permission to access this page."
        action={
          <Button variant="primary" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        }
      />
    );
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/admin/posts', label: 'Posts', icon: <FiFileText className="w-5 h-5" /> },
    { path: '/admin/quill-posts', label: 'Quill Posts', icon: <FiEdit3 className="w-5 h-5" /> },
    { path: '/admin/projects', label: 'Projects', icon: <FiFolder className="w-5 h-5" /> },
    { path: '/admin/forums', label: 'Forums', icon: <FiMessageSquare className="w-5 h-5" /> },
    { path: '/admin/files', label: 'Files', icon: <FiFolder className="w-5 h-5" /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers className="w-5 h-5" /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { path: '/admin/modules', label: 'Modules', icon: <FiGrid className="w-5 h-5" /> },
    { path: '/admin/plugins', label: 'Plugins', icon: <FiPackage className="w-5 h-5" /> },
    { path: '/admin/themes', label: 'Themes', icon: <FiLayers className="w-5 h-5" /> },
    { path: '/admin/navigation', label: 'Navigation', icon: <FiMenu className="w-5 h-5" /> },
    { path: '/admin/content', label: 'Content', icon: <FiPlusCircle className="w-5 h-5" /> },
    { path: '/admin/settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">MCMS Admin</h1>
            </div>
            <div className="flex flex-col flex-grow px-4 mt-5">
              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  onClick={() => {
                    // Mobile menu toggle logic
                    const sidebar = document.getElementById('mobile-sidebar');
                    if (sidebar) {
                      sidebar.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="sr-only">Open sidebar</span>
                  <FiMenu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{title}</h1>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Site
                  </Link>
                </div>
              </div>
            </div>
            {description && (
              <div className="pb-4">
                <p className="text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            )}
          </div>
        </header>

        {/* Mobile sidebar */}
        <div id="mobile-sidebar" className="md:hidden fixed inset-0 z-40 hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => {
            const sidebar = document.getElementById('mobile-sidebar');
            if (sidebar) {
              sidebar.classList.add('hidden');
            }
          }}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-full pb-4 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between px-4 pt-5 pb-2">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">MCMS Admin</h1>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                onClick={() => {
                  const sidebar = document.getElementById('mobile-sidebar');
                  if (sidebar) {
                    sidebar.classList.add('hidden');
                  }
                }}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-5 flex-1 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive(item.path)
                        ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      const sidebar = document.getElementById('mobile-sidebar');
                      if (sidebar) {
                        sidebar.classList.add('hidden');
                      }
                    }}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
