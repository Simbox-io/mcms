// components/ActivityTimeline.tsx
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/Avatar';

interface Activity {
  id: number;
  type: string;
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  metadata: {
    [key: string]: any;
  };
  createdAt: string;
}

interface ActivityTimelineProps {
  projectId: number;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ projectId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/activities`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          console.error('Error fetching activities:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, [projectId]);

  const renderActivityContent = (activity: Activity) => {
    switch (activity.type) {
      case 'FILE_UPLOAD':
        return (
          <p>
            Uploaded file: <strong>{activity.metadata.fileName}</strong>
          </p>
        );
      case 'TASK_ASSIGNMENT':
        return (
          <p>
            Assigned task to <strong>{activity.metadata.assigneeName}</strong>
          </p>
        );
      case 'COMMENT':
        return <p>Commented: {activity.metadata.comment}</p>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex">
          <div className="flex-shrink-0">
            <Avatar src={activity.user.avatar} alt={activity.user.username} size="medium" />
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              <span className="font-semibold">{activity.user.username}</span>
              <span className="ml-2 text-gray-500 text-sm">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </span>
            </div>
            {renderActivityContent(activity)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;