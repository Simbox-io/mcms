// app/admin/configuration/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Sidebar from '@/components/base/Sidebar';
import AnalyticsPage from './analytics/page';
import DashboardPage from './dashboard/page';
import PostsPage from './posts/page';
import PluginsPage from './plugins/page';
import SettingsPage from './settings/page';
import UsersPage from './users/page';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/base/Spinner';
import { User } from '@/lib/prisma';

const AdminConfigurationPage: React.FC = () => {
  const [activeSubpage, setActiveSubpage] = useState('dashboard');
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as User;

  const handleSubpageChange = (subpage: string) => {
    setActiveSubpage(subpage);
  };

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
    <div className="flex flex-col lg:flex-row h-full">
      <div className="md:hidden">
        <Sidebar
          items={[
            { id: 'dashboard', label: 'Admin Dashboard' },
            { id: 'posts', label: 'Posts' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'plugins', label: 'Plugin Management' },
            { id: 'users', label: 'User Management' },
            { id: 'settings', label: 'Global Settings' },
          ]}
          activeItem={activeSubpage}
          onItemClick={handleSubpageChange}
        />
      </div>
      <div className="hidden md:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <Sidebar
            items={[
              { id: 'dashboard', label: 'Admin Dashboard' },
              { id: 'posts', label: 'Posts' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'plugins', label: 'Plugin Management' },
              { id: 'users', label: 'User Management' },
              { id: 'settings', label: 'Global Settings' },
            ]}
            activeItem={activeSubpage}
            onItemClick={handleSubpageChange}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Card className="dark:bg-gray-800 shadow-xl m-8">
          {activeSubpage === 'dashboard' && <DashboardPage />}
          {activeSubpage === 'posts' && <PostsPage />}
          {activeSubpage === 'analytics' && <AnalyticsPage />}
          {activeSubpage === 'plugins' && <PluginsPage />}
          {activeSubpage === 'users' && <UsersPage />}
          {activeSubpage === 'settings' && <SettingsPage />}
        </Card>
      </div>
    </div>
  );
};

export default AdminConfigurationPage;