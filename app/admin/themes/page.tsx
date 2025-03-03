'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/prisma';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/next-gen/Button';
import Spinner from '@/components/base/Spinner';
import Card from '@/components/next-gen/Card';

const ThemesPage = () => {
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState('default');
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();

  // Simulated themes data
  const mockThemes = [
    { id: 'default', name: 'Default Theme', description: 'The default system theme', isActive: true, preview: '/themes/default.jpg' },
    { id: 'dark', name: 'Dark Mode', description: 'A dark-themed interface', isActive: false, preview: '/themes/dark.jpg' },
    { id: 'light', name: 'Light Mode', description: 'A light and minimal interface', isActive: false, preview: '/themes/light.jpg' },
  ];

  useEffect(() => {
    // This would typically fetch themes data from an API
    // For now, we'll just simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      setThemes(mockThemes);
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

  const activateTheme = (themeId) => {
    // This would typically call an API to activate the theme
    setThemes(themes.map(theme => ({
      ...theme,
      isActive: theme.id === themeId
    })));
    setActiveTheme(themeId);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Theme Management</h1>
        <div className="space-x-2">
          <Button variant="primary">Upload Theme</Button>
          <Button variant="secondary">Theme Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <Card key={theme.id} className="overflow-hidden">
            <div className="h-40 bg-gray-200 dark:bg-gray-700">
              {/* This would typically show a theme preview image */}
              <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                Theme Preview
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{theme.name}</h3>
                {theme.isActive && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Active
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2 mb-4">{theme.description}</p>
              <div className="flex space-x-2">
                {!theme.isActive && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => activateTheme(theme.id)}
                  >
                    Activate
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="flex-1"
                >
                  Customize
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThemesPage;
