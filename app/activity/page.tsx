// app/activity/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import { formatDate } from '../../utils/dateUtils';
import { useToken } from '../../lib/useToken';

interface Activity {
  id: number;
  type: 'post' | 'comment' | 'file' | 'follow';
  user: {
    id: number;
    username: string;
  };
  itemId: number;
  createdAt: string;
}

const ActivityFeedPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const token = useToken();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/activity?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setActivities(data.activities);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching activities:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session && token) {
      fetchActivities();
    }
  }, [currentPage, session, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getActivityMessage = (activity: Activity) => {
    switch (activity.type) {
      case 'post':
        return `${activity.user.username} created a new post`;
      case 'comment':
        return `${activity.user.username} commented on a post`;
      case 'file':
        return `${activity.user.username} uploaded a new file`;
      case 'follow':
        return `${activity.user.username} followed you`;
      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Activity Feed</h1>
      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <p className="text-gray-600 dark:text-gray-400">{getActivityMessage(activity)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(activity.createdAt)}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ActivityFeedPage;