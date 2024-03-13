// app/admin/configuration/page.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Sidebar from '@/components/Sidebar';
import AnalyticsPage from './analytics/page';
import DashboardPage from './dashboard/page';
import PluginsPage from './plugins/page';
import SettingsPage from './settings/page';
import UsersPage from './users/page';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
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
            { id: 'analytics', label: 'Analytics' },
            { id: 'plugins', label: 'Plugin Management' },
            { id: 'users', label: 'User Management' },
            { id: 'settings', label: 'Global Settings' },
          ]}
          activeItem={activeSubpage}
          onItemClick={handleSubpageChange}
        />
      </div>
      <div className="flex flex-col lg:flex-row h-full">
        <div className="hidden md:block">
          <Sidebar
            items={[
              { id: 'dashboard', label: 'Admin Dashboard' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'plugins', label: 'Plugin Management' },
              { id: 'users', label: 'User Management' },
              { id: 'settings', label: 'Global Settings' },
            ]}
            activeItem={activeSubpage}
            onItemClick={handleSubpageChange}
          />
        </div>
        <div className="flex-1 p-8">
          <Card className="dark:bg-gray-800 shadow-xl">
            {activeSubpage === 'dashboard' && <DashboardPage />}
            {activeSubpage === 'analytics' && <AnalyticsPage />}
            {activeSubpage === 'plugins' && <PluginsPage />}
            {activeSubpage === 'users' && <UsersPage />}
            {activeSubpage === 'settings' && <SettingsPage />}
          </Card>
        </div>
      </div>
    </div>
  )
};

export default AdminConfigurationPage;