'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Textarea from '@/components/next-gen/Textarea';
import Select from '@/components/next-gen/Select';
import Checkbox from '@/components/next-gen/Checkbox';
import Radio from '@/components/next-gen/Radio';
import Spinner from '@/components/next-gen/Spinner';
import { Space, CollaboratorRole, ExportFormat } from '@/lib/prisma';
import instance from '@/utils/api';

const CreateSpacePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('PRIVATE');
  const [allowCollaborators, setAllowCollaborators] = useState(true);
  const [collaboratorRoles, setCollaboratorRoles] = useState<CollaboratorRole>(CollaboratorRole.VIEWER);
  const [enableVersioning, setEnableVersioning] = useState(false);
  const [versionNamingConvention, setVersionNamingConvention] = useState('v{major}.{minor}.{patch}');
  const [allowExport, setAllowExport] = useState(true);
  const [exportFormats, setExportFormats] = useState<ExportFormat>(ExportFormat.PDF);
  const [enableAutoBackup, setEnableAutoBackup] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState('DAILY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      setError('Please enter a name for the space.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newSpace = {
        name,
        description,
        settings: {
          accessControlSettings: {
            visibility,
          },
          collaborationSettings: {
            allowCollaborators,
            collaboratorRoles,
          },
          versionControlSettings: {
            enableVersioning,
            versionNamingConvention,
          },
          exportSettings: {
            allowExport,
            exportFormats,
          },
          backupSettings: {
            enableAutoBackup,
            backupFrequency,
          },
        },
      };

      // Make an API request to create the space on the server
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSpace),
      });

      if (response.ok) {
        const createdSpace = await response.json();
        // Redirect to the newly created space page using the actual space ID or name
        router.push(`/spaces/${createdSpace.id}`);
      } else {
        throw new Error('Failed to create space');
      }
    } catch (error) {
      console.error('Error creating space:', error);
      setError('An error occurred while creating the space. Please try again.');
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-center">Create New Space</h1>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
              Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(value) => setName(value)}
              required
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter space name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(value) => setDescription(value)}
              rows={4}
              className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter space description"
            />
          </div>
          <div className="mb-6">
            <div className="mb-4">
              <label htmlFor="visibility" className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
                Visibility
              </label>
              <Select
                value={visibility}
                onChange={(value) => setVisibility(value)}
                options={[
                  { value: 'PUBLIC', label: 'Public' },
                  { value: 'PRIVATE', label: 'Private' },
                ]}
                className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-red-500 mb-6"
            >
              {error}
            </motion.p>
          )}
          <Button
            variant="primary"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? <Spinner size="small" /> : 'Create Space'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateSpacePage;
