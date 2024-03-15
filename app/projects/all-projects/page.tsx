// app/projects/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Pagination from '../../../components/Pagination';
import Spinner from '../../../components/Spinner';
import { formatDate } from '../../../utils/dateUtils';

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: number;
    username: string;
  };
  members: {
    id: number;
    username: string;
  }[];
}

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/projects?page=${currentPage}`);

        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching projects:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateProject = () => {
    router.push('/projects/create');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white">Projects</h1>
        <Button variant="primary" onClick={handleCreateProject}>
          Create Project
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id}>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {project.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Created by {project.owner.username}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Members:</p>
                    <ul className="list-disc list-inside">
                      {project.members.map((member) => (
                        <li key={member.id} className="text-gray-600 dark:text-gray-400">
                          {member.username}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
        </>
      )}
    </div>
  );
};

export default ProjectListPage;