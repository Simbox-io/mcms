// app/admin/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Table from '../../../components/Table';
import Spinner from '../../../components/Spinner';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Post {
  id: number;
  title: string;
  author: {
    username: string;
  };
  createdAt: string;
}

const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, postsResponse] = await Promise.all([
          fetch('/api/admin/users'),
          fetch('/api/admin/posts'),
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

  if (session?.user?.role !== 'ADMIN') {
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Users">
            <Table
              columns={[
                { header: 'Username', accessor: 'username' },
                { header: 'Email', accessor: 'email' },
                { header: 'Role', accessor: 'role' },
              ]}
              data={users}
            />
          </Card>
          <Card title="Recent Posts">
            <Table
              columns={[
                { header: 'Title', accessor: 'title' },
                { header: 'Author', accessor: 'author.username' },
                { header: 'Created At', accessor: 'createdAt' },
              ]}
              data={posts}
            />
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;