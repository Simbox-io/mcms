'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/next-gen/Button';
import Spinner from '@/components/base/Spinner';
import Card from '@/components/next-gen/Card';

const ContentPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  const contentTypes = [
    { title: 'Posts', description: 'Manage blog posts and articles', link: '/admin/posts', count: 0 },
    { title: 'Pages', description: 'Manage static pages', link: '/admin/pages', count: 0 },
    { title: 'Projects', description: 'Manage projects and portfolios', link: '/admin/projects', count: 0 },
    { title: 'Forums', description: 'Manage forum categories and threads', link: '/admin/forums', count: 0 },
    { title: 'Media', description: 'Manage images, videos, and other media', link: '/admin/files', count: 0 },
  ];

  if (status === 'loading') {
    return <Spinner />;
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentTypes.map((type, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(type.link)}>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{type.title}</h2>
              <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {type.count}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{type.description}</p>
            <Button variant="secondary" className="w-full">
              Manage {type.title}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentPage;
