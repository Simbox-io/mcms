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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, postsResponse, projectsResponse, spacesResponse, tutorialsResponse, activitiesResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/posts'),
          fetch('/api/projects'),
          fetch('/api/spaces'),
          fetch('/api/tutorials'),
          fetch('/api/activities'),
        ]);

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        } else {
          console.error('Error fetching users:', usersResponse.statusText);
        }

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        } else {
          console.error('Error fetching posts:', postsResponse.statusText);
        }

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        } else {
          console.error('Error fetching projects:', projectsResponse.statusText);
        }

        if (spacesResponse.ok) {
          const spacesData = await spacesResponse.json();
          setSpaces(spacesData);
        } else {
          console.error('Error fetching spaces:', spacesResponse.statusText);
        }

        if (tutorialsResponse.ok) {
          const tutorialsData = await tutorialsResponse.json();
          setTutorials(tutorialsData);
        } else {
          console.error('Error fetching tutorials:', tutorialsResponse.statusText);
        }

        if (activitiesResponse.ok) {
          const activitiesData = await activitiesResponse.json();
          setActivities(activitiesData);
        } else {
          console.error('Error fetching activities:', activitiesResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <Card
              title={String(<span><FaUsers className="w-8 h-8 mb-2 text-blue-500" />Total Users</span>)}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              {users?.length || <span>0</span>}
            </Card>
            <Card
              title={String(<span><FaFile className="w-8 h-8 mb-2 text-green-500" />Total Posts</span>)}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              {posts?.length || <span>0</span>}
            </Card>
            <Card
              title={String(<span><FaFolder className="w-8 h-8 mb-2 text-yellow-500" />Total Projects</span>)}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              {projects?.length || <span>0</span>}
            </Card>
            <Card
              title={String(<span><FaBook className="w-8 h-8 mb-2 text-purple-500" />Total Tutorials</span>)}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              {tutorials?.length || <span>0</span>}
            </Card>
            <Card
              title={String(<span><FaChartBar className="w-8 h-8 mb-2 text-red-500" />Total Activities</span>)}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
              {activities?.length || <span>0</span>}
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <Card
              title="Recent Users"
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
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
              title="Recent Posts"
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            >
              <Table
                className='px-0 py-0'
                emptyText='No posts found.'
                columns={[
                  { header: 'Title', accessor: 'title' },
                  { header: 'Author', accessor: (post: Post) => post.author.username },
                  {
                    header: 'Created At',
                    accessor: (post: Post) => format(new Date(post.createdAt), 'MMM d, yyyy'),
                  },
                ]}
                data={posts}
              />
            </Card>

            <Card
              title="Recent Projects"
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            >
              <Table
                className='px-0 py-0'
                emptyText='No projects found.'
                columns={[
                  { header: 'Name', accessor: 'name' },
                  { header: 'Owner', accessor: (project: Project) => project.owner.username },
                  {
                    header: 'Created At',
                    accessor: (project: Project) => format(new Date(project.createdAt), 'MMM d, yyyy'),
                  },
                ]}
                data={projects}
              />
            </Card>
            <Card
              title="Recent Tutorials"
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
            >
              <Table
                className='px-0 py-0'
                emptyText='No tutorials found.'
                columns={[
                  { header: 'Title', accessor: 'title' },
                  { header: 'Author', accessor: (tutorial: Tutorial) => tutorial.author.username },
                  {
                    header: 'Created At',
                    accessor: (tutorial: Tutorial) => format(new Date(tutorial.createdAt), 'MMM d, yyyy'),
                  },
                ]}
                data={tutorials}
              />
            </Card>

            <Card
              title="Recent Activities"
              className="bg-white dark:bg-gray-800 shadow-lg rounded-lg col-span-2"
            >
              <Table
                className='px-0 py-0'
                emptyText='No activities found.'
                columns={[
                  { header: 'User', accessor: (activity: Activity) => activity.user.username },
                  { header: 'Activity Type', accessor: 'activityType' },
                  {
                    header: 'Created At',
                    accessor: (activity: Activity) => format(new Date(activity.createdAt), 'MMM d, yyyy'),
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