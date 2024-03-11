// app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import Spinner from '@/components/Spinner';

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
}

interface Notification {
  id: number;
  message: string;
  createdAt: string;
}

interface Activity {
  id: number;
  type: string;
  message: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === 'unauthenticated') {
          if (!session) {
            router.push('/login');
            return;
          }
        }

        const [userResponse, projectsResponse, notificationsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/users'),
          fetch(`/api/projects?page=${currentPage}`),
          fetch('/api/notifications'),
          fetch('/api/activity'),
        ]);

        if (userResponse.ok) {
          const userData: User = await userResponse.json();
          setUser(userData);
        } else {
          router.push('/login');
        }

        if (projectsResponse.ok) {
          const projectsData: Project[] = await projectsResponse.json();
          setProjects(projectsData);
        }

        if (notificationsResponse.ok) {
          const notificationsData: Notification[] = await notificationsResponse.json();
          setNotifications(notificationsData);
        }

        if (activitiesResponse.ok) {
          const activitiesData: Activity[] = await activitiesResponse.json();
          setActivities(activitiesData);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    fetchData();
  }, [currentPage, router, session]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  if (status === 'loading') {
    return <Spinner />;
  }

  return (

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
        Welcome, {user?.username}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <Card title="Projects">
          <div className="mb-4">
            {projects && projects.length > 0 && projects.map((project) => (
              <div
                key={project.id}
                className="border-b border-gray-200 dark:border-gray-700 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleProjectClick(project.id)}
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {project.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(projects.length / 10)}
              onPageChange={handlePageChange}
            />
            <Button variant="primary" onClick={handleCreateProject}>
              Create Project
            </Button>
          </div>
        </Card>

        <Card title="Notifications">
          {notifications && notifications.length > 0 && notifications.map((notification) => (
            <div key={notification.id} className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">{notification.message}</p>
              <Badge variant="info">{new Date(notification.createdAt).toLocaleString()}</Badge>
            </div>
          ))}
        </Card>

        <Card title="Activity">
          {activities && activities.length > 0 && activities.map((activity) => (
            <div key={activity.id} className="mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">{activity.type}</span> - {activity.message}
              </p>
              <Badge variant="secondary">{new Date(activity.createdAt).toLocaleString()}</Badge>
            </div>
          ))}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Your Profile">
          {user && (
            <div className="flex items-center mb-4">
              <Avatar src={user.avatar} alt={user.username} size="large" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {user.username}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-400">{user?.bio}</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card title="Quick Links">
          <ul className="space-y-2">
            <li>
              <a
                href="/docs"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="/support"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
              >
                Settings
              </a>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;