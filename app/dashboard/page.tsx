// app/dashboard/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '@/components/next-gen/Card';
import Badge from '@/components/next-gen/Badge';
import Pagination from '@/components/next-gen/Pagination';
import Button from '@/components/next-gen/Button';
import Avatar from '@/components/next-gen/Avatar';
import Spinner from '@/components/next-gen/Spinner';
import Table from '@/components/next-gen/Table';
import Alert from '@/components/next-gen/Alert';
import EmptyState from '@/components/EmptyState';
import Modal from "@/components/next-gen/Modal";
import { instance } from '@/utils/api';

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
  const [loading, setLoading] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const userObj = session?.user as User;
 
  
  useEffect(() => {
    setLoading(true);
    if (status === 'unauthenticated' && !session) {
      router.push('/login');
      return;
    }

    const fetchProjects = async () => {
      const response = await instance.get(`api/projects`);
      setProjects(response.data.projects);
    };

    const fetchNotifications = async () => {
      const response = await instance.get(`api/notifications`);
      setNotifications(response.data.notifications);
    };

    const fetchActivities = async () => {
      const response = await instance.get(`api/activities`);
      setActivities(response.data.activities);
    };

    if (session) {
      setUser(userObj);
      fetchProjects();
      fetchNotifications();
      fetchActivities();
      setLoading(false);
    }
  }, [session, status]);

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

  if (loading) {
    return <Spinner />;
  }

  const itemsPerPage = 10;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageProjects = projects.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-8 h-full">
      {showAlert && (
        <Alert
          variant="info"
          onClose={() => setShowAlert(false)}
          className="mb-8"
          message='Welcome to your dashboard! Here you can manage your projects, view notifications, and track activity.'
          autoDismissTimeout={10000}
        />
      )}
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Welcome, {user?.firstName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <Card header="Projects" 
          bodyClassName='px-0 py-0 overflow-y-scroll h-72'
        >
          {projects?.length === 0 ? (
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
                  { header: ' ', accessor: 'name' },
                ]}
                data={currentPageProjects}
                rowClassName="cursor-pointer"
                onRowClick={handleProjectClick}
              />
              <div className="flex justify-between items-center">
                {totalPages > 1 && (<Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />)}
                <Button variant="primary" className='mx-4 my-4' onClick={handleCreateProject}>
                  Create Project
                </Button>
              </div>
            </>
          )}
        </Card>
        <Card header="Recent Notifications" className='h-auto' bodyClassName='overflow-y-scroll'>
          {notifications?.length === 0 ? (
            <EmptyState
              title="No Notifications"
              description="You don't have any notifications at the moment."
            />
          ) : (
            notifications?.slice(0,5).map((notification) => (
              <div key={notification.id} className="mb-4">
                <p className="text-gray-600 dark:text-gray-400">{notification.message}</p>
                <Badge variant="info">{new Date(notification.createdAt).toLocaleString()}</Badge>
              </div>
            ))
          )}
        </Card>
        <Card header="Activity" >
          {activities?.length === 0 ? (
            <EmptyState
              title="No Recent Activity"
              description="There hasn't been any recent activity."
            />
          ) : (
            activities?.map((activity) => (
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
              <p className="text-gray-600 dark:text-gray-400"><span dangerouslySetInnerHTML={{__html: selectedProject.description}}/></p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Repository: <a href={selectedProject.repository} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500">
                  {selectedProject.repository}
                </a>
              </p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Owner: {selectedProject.owner?.username}</p>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Members:</p>
              <ul className="mb-4">
                {selectedProject.members?.map((member) => (
                  <li key={member?.id} className="text-gray-600 dark:text-gray-400">{member?.username}</li>
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
        <Card header="Your Profile">
          {user && (
            <div className="flex items-center mb-4">
              <Avatar src={user.avatar} alt={user.username || ''} size="large" />
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
        <Card header="Resources">
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
