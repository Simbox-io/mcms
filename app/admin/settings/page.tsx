// app/admin/settings/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import { User } from '@prisma/client';

interface SiteSettings {
  title: string;
  description: string;
  logo: string;
  favicon: string;
}

const SiteSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    title: '',
    description: '',
    logo: '',
    favicon: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as User;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        } else {
          console.error('Error fetching site settings:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        console.error('Error updating site settings:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating site settings:', error);
    }

    setIsSaving(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Site Settings</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Spinner size="large" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                label="Site Title"
                type="text"
                id="title"
                name="title"
                value={settings.title}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <Input
                label='Site Description'
                type="text"
                id="description"
                name="description"
                value={settings.description}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <Input
                label="Site Logo URL"
                type="text"
                id="logo"
                name="logo"
                value={settings.logo}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div className="mb-6">
              <Input
                label="Favicon URL"
                type="text"
                id="favicon"
                name="favicon"
                value={settings.favicon}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default SiteSettingsPage;