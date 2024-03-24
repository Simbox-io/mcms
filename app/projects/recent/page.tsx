// app/projects/recent/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/next-gen/Card';
import Spinner from '../../../components/next-gen/Spinner';
import { formatDate } from '../../../utils/dateUtils';
import { motion } from 'framer-motion';
import CacheService from '../../../lib/cacheService';
import axios from 'axios';

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

const RecentProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheKey = `/api/projects/recent`;
        const cachedData = await CacheService.get<{ projects: Project[] }>(cacheKey);

        if (cachedData) {
          setProjects(cachedData.projects);
        } else {
          const response = await axios.get(`/api/projects/recent`);
          if (response.status === 200) {
            const data = response.data;
            setProjects(data.projects);
            await CacheService.set(cacheKey, data);
          } else {
            console.error('Error fetching recent projects:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching recent projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectProject = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Recent Projects</h2>
      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <Spinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectProject(project)}
            >
              <Card className="h-72">
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description.slice(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <p className="text-gray-600 dark:text-gray-400">
                      Created by {project.owner.username}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentProjectsPage;
