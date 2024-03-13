// app/projects/create/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToken } from '../../../lib/useToken';
import Input from '../../../components/Input';
import Textarea from '../../../components/Textarea';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Select from '../../../components/Select';

interface User {
  id: string;
  username: string;
}

const CreateProjectPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repository, setRepository] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const token = useToken();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    };

    getUsers();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, repository, members: selectedMembers }),
      });

      if (response.ok) {
        router.push('/projects');
      } else {
        console.error('Error creating project:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }

    setIsSubmitting(false);
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const users: User[] = await response.json();
        return users;
      } else {
        console.error('Error fetching users:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Create Project</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              label="Name"
              name="name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={setDescription}
              required
              rows={4}
            />
          </div>
          <div className="mb-6">
            <Input
              label="Repository"
              name="repository"
              type="text"
              id="repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-6">
            {/*<Select
              title="Members"
              options={users.map(user => ({ value: user.id, label: user.username }))}
              value={selectedMembers}
              onChange={(memberIds) => setSelectedMembers(Array.isArray(memberIds) ? memberIds.map(String) : [])}
              isMulti
            />*/}
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

export default CreateProjectPage;