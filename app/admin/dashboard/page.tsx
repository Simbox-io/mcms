// app/admin/dashboard/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '@/components/next-gen/Card';
import Table from '@/components/next-gen/Table';
import Spinner from '@/components/next-gen/Spinner';
import { User, Post, Project, Space, Tutorial, Activity } from '@/lib/prisma';
import { FaUsers, FaFile, FaFolder, FaBook, FaChartBar } from 'react-icons/fa';
import { format } from 'date-fns';
import { useAPI } from '@/lib/hooks/useAPI';

const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as User;

  const usersData = useAPI('/api/users');
  const postsData = useAPI('/api/posts');
  const projectsData = useAPI('/api/projects');
  const spacesData = useAPI('/api/spaces');
  const tutorialsData = useAPI('/api/tutorials');
  const activitiesData = useAPI('/api/activities');

  useEffect(() => {
    if (
      usersData.data &&
      postsData.data &&
      projectsData.data &&
      spacesData.data &&
      tutorialsData.data &&
      activitiesData.data
    ) {
      setUsers(usersData.data?.users);
      setPosts(postsData.data?.posts);
      setProjects(projectsData.data?.projects);
      setSpaces(spacesData.data?.spaces);
      setTutorials(tutorialsData.data?.tutorials);
      setActivities(activitiesData.data?.activities);
      setIsLoading(false);
    }
  }, [usersData.data, postsData.data, projectsData.data, spacesData.data, tutorialsData.data, activitiesData.data]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Admin Dashboard</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              header={<span><FaUsers className="w-8 h-8 mb-2 text-blue-500" />Total Users</span>}
                          >
              {users?.length || <span>0</span>}
            </Card>
            <Card
              header={<span><FaFile className="w-8 h-8 mb-2 text-green-500" />Total Posts</span>}
            >
              {posts?.length || <span>0</span>}
            </Card>
            <Card
              header={<span><FaFolder className="w-8 h-8 mb-2 text-yellow-500" />Total Projects</span>}
            >
              {projects?.length || <span>0</span>}
            </Card>
            <Card
              header={<span><FaBook className="w-8 h-8 mb-2 text-purple-500" />Total Tutorials</span>}
            >
              {tutorials?.length || <span>0</span>}
            </Card>
            <Card
              header={<span><FaChartBar className="w-8 h-8 mb-2 text-red-500" />Total Activities</span>}
            >
              {activities?.length || <span>0</span>}
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-6">
            <Card
              header="Recent Users"
            >
              <Table
                className='px-0 py-0'
                columns={[
                  { header: 'Username', accessor: 'username' },
                  { header: 'Email', accessor: 'email' },
                  { header: 'Role', accessor: 'role' },
                ]}
                data={users}
              />
            </Card>

            <Card
              header="Recent Posts"
            >
              <Table
                className='px-0 py-0'
                columns={[
                  { header: 'Title', accessor: 'title' },
                  { header: 'Author', accessor: (post: Post) => post?.author.username },
                  {
                    header: 'Created At',
                    accessor: (post: Post) => format(new Date(post?.createdAt), 'MMM d, yyyy'),
                  },
                ]}
                data={posts}
              />
            </Card>

            <Card
              header="Recent Projects"
            >
              <Table
                className='px-0 py-0'
                columns={[
                  { header: 'Name', accessor: 'name' },
                  { header: 'Owner', accessor: (project: Project) => project?.owner.username },
                  {
                    header: 'Created At',
                    accessor: (project: Project) => format(new Date(project?.createdAt), 'MMM d, yyyy'),
                  },
                ]}
                data={projects}
              />
            </Card>
            <Card
              header="Recent Tutorials"
            >
              <Table
                className='px-0 py-0'
                columns={[
                  { header: 'Title', accessor: 'title' },
                  { header: 'Author', accessor: (tutorial: Tutorial) => tutorial?.author.username },
                  {
                    header: 'Created At',
                    accessor: (tutorial: Tutorial) => format(new Date(tutorial?.createdAt), 'MMM d, yyyy'),
                  },
                ]}
                data={tutorials}
              />
            </Card>

            <Card
              header="Recent Activities"
              className="col-span-2"
            >
              <Table
                className='px-0 py-0'
                columns={[
                  { header: 'User', accessor: (activity: Activity) => activity?.user?.username },
                  { header: 'Activity Type', accessor: 'activityType' },
                  {
                    header: 'Created At',
                    accessor: (activity: Activity) => format(new Date(activity?.createdAt), 'MMM d, yyyy'),
                  },
                ]}
                data={activities}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;