// components/ActivityFeed.tsx
import React, { useState, useEffect } from 'react';
import { Activity, ActivityType } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar';

interface ActivityFeedProps {
  projectId: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ projectId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/activities?page=${page}`);
        if (response.ok) {
          const data = await response.json();
          setActivities((prevActivities) => [...prevActivities, ...data.activities]);
          setHasMore(data.hasMore);
        } else {
          console.error('Error fetching activities:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, [projectId, page]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const renderActivity = (activity: Activity) => {
    switch (activity.activityType) {
      case ActivityType.FILE_UPLOADED:
        return (
          <div className="flex items-center">
            <Avatar src={activity.user.avatar || ''} size="small" />
            <span className="ml-2">
              {activity.user.username} uploaded a file: {activity.metadata?.fileName}
            </span>
          </div>
        );
      case ActivityType.PROJECT_CREATED:
        return (
          <div className="flex items-center">
            <Avatar src={activity.user.avatar || ''} size="small" />
            <span className="ml-2">
              {activity.user.username} created project {activity.metadata.projectName}
            </span>
          </div>
        );
      case ActivityType.COMMENT_CREATED:
        return (
          <div className="flex items-center">
            <Avatar src={activity.user.avatar || ''} size="small" />
            <span className="ml-2">
              {activity.user.username} commented: {activity.metadata.comment}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Activity Feed</h2>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id}>
              {renderActivity(activity)}
              <p className="text-sm text-gray-500 mt-1">
                {formatDistanceToNow(new Date(activity.createdAt))} ago
              </p>
            </li>
          ))}
        </ul>
      )}
      {hasMore && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={loadMore}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default ActivityFeed;