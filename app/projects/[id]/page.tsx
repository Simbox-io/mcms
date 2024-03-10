'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Tabs from '@/components/Tabs';

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);

        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error('Error fetching project:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
          {project.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{project.description}</p>
        <Tabs
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              content: (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Project overview content goes here.
                  </p>
                </div>
              ),
            },
            {
              id: 'files',
              label: 'Files',
              content: (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Project files go here.</p>
                </div>
              ),
            },
            {
              id: 'members',
              label: 'Members',
              content: (
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Project members go here.</p>
                </div>
              ),
            },
          ]}
        />
        <div className="mt-8">
          <Button>Edit</Button>
          <Button variant="danger" className="ml-4">
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;