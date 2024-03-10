// app/wikis/create/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '../../../lib/useToken';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Select from '../../../components/Select';

interface Project {
  id: number;
  name: string;
}

const CreateWikiPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const token = useToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedProject) {
      console.error('Please select a project');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/wikis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, projectId: selectedProject }),
      });

      if (response.ok) {
        router.push('/wikis');
      } else {
        console.error('Error creating wiki:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating wiki:', error);
    }

    setIsSubmitting(false);
  };

  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const response = await fetch('/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const projects: Project[] = await response.json();
        return projects;
      } else {
        console.error('Error fetching projects:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Create Wiki</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={setContent}
              required
              rows={8}
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="project" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Project
            </label>
            <Select
              id="project"
              options={fetchProjects}
              value={selectedProject}
              onChange={(projectId) => setSelectedProject(Number(projectId))}
              placeholder="Select a project"
              className="w-full"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateWikiPage;