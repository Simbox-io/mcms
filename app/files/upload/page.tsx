// app/files/upload/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '../../../lib/useToken';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import Select from '../../../components/Select';
import { Project } from '@/lib/prisma';

const FileUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();
  const token = useToken();

  useEffect(() => {
    const fetchAndSetProjects = async () => {
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
    };

    fetchAndSetProjects();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    if (!selectedFile) {
      console.error('Please select a file');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', description);
    formData.append('isPublic', String(isPublic));
    if (selectedProject) {
      formData.append('projectId', String(selectedProject));
    }

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push('/files');
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    setIsUploading(false);
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
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Upload File</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              label='File'
              name="file"
              value={selectedFile?.name || ''}
              type="file"
              id="file"
              onChange={handleFileChange}
              required
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              value={description}
              onChange={setDescription}
              rows={4}
            />
          </div>
          <div className="mb-6">
            <Select
              label='Visibility'
              value={[isPublic.toString()]}
              onChange={(value) => setIsPublic(value[0] === 'true')}
              options={[
                { value: 'true', label: 'Public' },
                { value: 'false', label: 'Private' },
              ]}
            />
          </div>
          <div className="mb-6">
            <Select
              label='Project'
              options={projects && projects.map(project => ({ value: project.id.toString(), label: project.name }))}
              value={selectedProject && [selectedProject !== null] ? [selectedProject[0]] : ['']}
              onChange={(projectId: string | string[]) => {
                if (typeof projectId === 'string') {
                  setSelectedProject(projectId);
                } else if (Array.isArray(projectId) && projectId.length > 0) {
                  setSelectedProject(projectId[0]);
                }
              }}
              placeholder="Select a project"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FileUploadPage;