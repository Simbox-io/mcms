'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from '@/components/base/Form';
import Input from '@/components/base/Input';
import Textarea from '@/components/base/Textarea';
import Select from '@/components/base/Select';
import Button from '@/components/base/Button';
import TagInput from '@/components/base/TagInput';
import Toggle from '@/components/base/Toggle';
import Card from '@/components/base/Card';
import { Project } from '@prisma/client';

interface ProjectFormData extends Partial<Project> {
  name: string;
  description: string;
  tags: string[];
  settings: {
    visibility: 'PUBLIC' | 'PRIVATE';
    allowCollaborators: boolean;
  };
}

const EditProject: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: 'My Project',
    description: 'This is my awesome project.',
    tags: ['web', 'app'],
    settings: {
      visibility: 'PRIVATE',
      allowCollaborators: true,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleVisibilityChange = (selectedOption: typeof Option) => {
    setFormData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        visibility: selectedOption.value as 'PUBLIC' | 'PRIVATE',
      },
    }));
  };

  const handleAllowCollaboratorsChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData.settings,
        allowCollaborators: !prevData.settings.allowCollaborators,
      },
    }));
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData((prevData) => ({ ...prevData, tags }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Submit form data to server
    console.log(formData);
    router.push('/projects');
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto" effects={false} content={
        <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            Edit Project
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Update your project details and settings.
          </p>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={() =>handleChange}
              label="Project Name"
              placeholder="Enter project name"
              required
              fullWidth
            />
          </div>
          <div className="mb-6">
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
              required
              fullWidth
              rows={4}
            />
          </div>
          <div className="mb-6">
            <Select
              label="Visibility"
              options={[
                { value: 'PUBLIC', label: 'Public' },
                { value: 'PRIVATE', label: 'Private' },
              ]}
              value={formData.settings.visibility}
              onChange={handleVisibilityChange}
              fullWidth
            />
          </div>
          <div className="mb-6">
            <Toggle
              label="Allow Collaborators"
              checked={formData.settings.allowCollaborators}
              onChange={handleAllowCollaboratorsChange}
            />
          </div>
          <div className="mb-8">
            <TagInput
              tags={formData.tags}
              onChange={handleTagsChange}
              placeholder="Add tags..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="large">
              Save Changes
            </Button>
          </div>
        </Form>
        </>
      }/>
    </div>
  );
};

export default EditProject;