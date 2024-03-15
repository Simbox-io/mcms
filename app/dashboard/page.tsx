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
import Table from '@/components/Table';
import Alert from '@/components/Alert';
import EmptyState from '@/components/EmptyState';
import Modal from "@/components/Modal";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  bio: string;
}

interface Notification {
  id: number;
  userId: number;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface Activity {
  id: number;
  userId: number;
  type: string;
  message: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

interface Project {
  id: number;
  name: string;
  description: string;
  repository: string;
  createdAt: string;
  owner: {
    id: number;
    username: string;
  };
  members: {
    id: number;
    username: string;
  }[];
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (status === 'unauthenticated' && !session) {
          router.push('/login');
          return;
        }

        const [userResponse, projectsResponse, notificationsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/user'),
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
          const { projects: fetchedProjects } = await projectsResponse.json();
          const myProjects = fetchedProjects?.filter((project: Project) =>
            project.owner.id === user?.id || project.members.some((member) => member.id === user?.id)
          ) || [];
          setProjects(myProjects);
        }

        if (notificationsResponse.ok) {
          const { notifications: fetchedNotifications } = await notificationsResponse.json();
          setNotifications(fetchedNotifications);
        }

        if (activitiesResponse.ok) {
          const { activities: fetchedActivities } = await activitiesResponse.json();
          setActivities(fetchedActivities);
        }
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage, router, session, status, user?.id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectModalOpen(true);
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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProjects = projects.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8">
      {showAlert && (
        <Alert
          variant="info"
          onClose={() => setShowAlert(false)}
          className="mb-8"
        >
          Welcome to your dashboard! Here you can manage your projects, view notifications, and track activity.
        </Alert>
      )}
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Welcome, {user?.firstName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <Card title="Projects">
          {projects.length === 0 ? (
            <EmptyState
              title="No Projects"
              description="You don't have any projects yet. Start by creating a new project."
              action={
                <Button variant="primary" onClick={handleCreateProject}>
                  Create Project
                </Button>
              }
            />
          ) : (
            <>
              <Table
                columns={[
                  { header: 'Name', accessor: 'name' },
                  {
                    header: 'Owner',
                    accessor: (project: Project) => (
                      <label className="text-gray-600 dark:text-gray-400">{project.owner.username}</label>
                    ),
                  }
                ]}
                data={currentPageProjects}
                onRowClick={handleProjectClick}
                className="mb-4"
              />
              <div className="flex justify-between items-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                <Button variant="primary" onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            </>
          )}
        </Card>
        <Card title="Notifications">
          {notifications.length === 0 ? (
            <EmptyState
              title="No Notifications"
              description="You don't have any notifications at the moment."
            />
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">{notification.message}</p>
                <Badge variant="info">{new Date(notification.createdAt).toLocaleString()}</Badge>
              </div>
            ))
          )}
        </Card>
        <Card title="Activity">
          {activities.length === 0 ? (
            <EmptyState
              title="No Recent Activity"
              description="There hasn't been any recent activity."
            />
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">{activity.type}</span> - {activity.message}
                </p>
                <Badge variant="secondary">{new Date(activity.createdAt).toLocaleString()}</Badge>
              </div>
            ))
          )}
        </Card>
      </div>
      {selectedProject && (
        <Modal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} title={selectedProject.name}>
          {selectedProject && (
            <>
              <p className="text-gray-600 dark:text-gray-400">{selectedProject.description}</p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Repository: <a href={selectedProject.repository} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500">
                  {selectedProject.repository}
                </a>
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Owner: {selectedProject.owner.username}</p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Members:</p>
              <ul className="mb-4">
                {selectedProject.members.map((member) => (
                  <li key={member.id} className="text-gray-600 dark:text-gray-400">{member.username}</li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-4">
            <Button variant="primary" className="mr-4" onClick={() => router.push(`/projects/${selectedProject?.id}`)}>
              View Project
            </Button>
            <Button variant="secondary" onClick={() => setProjectModalOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Your Profile">
          {user && (
            <div className="flex items-center mb-4">
              <Avatar src={user.avatar} alt={user.username} size="large" />
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{user.username}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-400">{user?.bio}</p>
          <div className="mt-4">
            <Button variant="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
          </div>
        </Card>
        <Card title="Quick Links">
          <ul className="space-y-2">
            <li>
              <a
                href="https://simboxio.atlassian.net/servicedesk/customer/kb/view/67633849"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="https://simboxio.atlassian.net/servicedesk/customer/portal/10"
                target="_blank"
                rel="noopener noreferrer"
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
