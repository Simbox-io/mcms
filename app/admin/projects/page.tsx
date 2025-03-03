'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/next-gen/Button';
import Spinner from '@/components/base/Spinner';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  useEffect(() => {
    // This would typically fetch projects data from an API
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setProjects([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading') {
    return <Spinner />;
  }

  if (!session || !(user?.role === 'ADMIN')) {
    return (
      <EmptyState
        title="Unauthorized"
        description="You don't have permission to access this page."
        action={
          <Button variant="primary" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        }
      />
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects Management</h1>
        <Button variant="primary">Create Project</Button>
      </div>

      <EmptyState
        title="No Projects Found"
        description="You haven't created any projects yet."
        action={
          <Button variant="primary">
            Create Your First Project
          </Button>
        }
      />
    </div>
  );
};

export default ProjectsPage;
