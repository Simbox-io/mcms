// app/admin/analytics/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Spinner from '../../../components/Spinner';
import ProgressBar from '../../../components/ProgressBar';

interface Analytics {
  totalUsers: number;
  totalPosts: number;
  totalProjects: number;
  totalFiles: number;
}

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalPosts: 0,
    totalProjects: 0,
    totalFiles: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin/analytics');

        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          console.error('Error fetching analytics:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (session?.user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
        Analytics and Statistics
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card title="Total Users">
            <p className="text-4xl font-bold text-gray-800 dark:text-white">{analytics.totalUsers}</p>
          </Card>
          <Card title="Total Posts">
            <p className="text-4xl font-bold text-gray-800 dark:text-white">{analytics.totalPosts}</p>
          </Card>
          <Card title="Total Projects">
            <p className="text-4xl font-bold text-gray-800 dark:text-white">
              {analytics.totalProjects}
            </p>
          </Card>
          <Card title="Total Files">
            <p className="text-4xl font-bold text-gray-800 dark:text-white">{analytics.totalFiles}</p>
          </Card>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">User Engagement</h2>
        <ProgressBar progress={75} className="mb-4" />
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Project Completion
        </h2>
        <ProgressBar progress={60} />
      </div>
    </div>
  );
};

export default AnalyticsPage;