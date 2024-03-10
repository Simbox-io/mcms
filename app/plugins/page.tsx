// app/admin/plugins/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';

interface Plugin {
  id: number;
  name: string;
  description: string;
  version: string;
}

const PluginManagementPage: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const response = await fetch('/api/admin/plugins');

        if (response.ok) {
          const data = await response.json();
          setPlugins(data);
        } else {
          console.error('Error fetching plugins:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching plugins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlugins();
  }, []);

  const handleInstallPlugin = async () => {
    try {
      const response = await fetch('/api/admin/plugins', {
        method: 'POST',
      });

      if (response.ok) {
        const newPlugin = await response.json();
        setPlugins([...plugins, newPlugin]);
      } else {
        console.error('Error installing plugin:', response.statusText);
      }
    } catch (error) {
      console.error('Error installing plugin:', error);
    }
  };

  const handleUninstallPlugin = async (pluginId: number) => {
    try {
      const response = await fetch(`/api/admin/plugins/${pluginId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPlugins(plugins.filter((plugin) => plugin.id !== pluginId));
      } else {
        console.error('Error uninstalling plugin:', response.statusText);
      }
    } catch (error) {
      console.error('Error uninstalling plugin:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (session?.user?.role !== 'ADMIN') {
    router.push('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
        Plugin Management
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <Button onClick={handleInstallPlugin}>Install New Plugin</Button>
          </div>
          <Table
            columns={[
              { header: 'Name', accessor: 'name' },
              { header: 'Description', accessor: 'description' },
              { header: 'Version', accessor: 'version' },
              {
                header: 'Actions',
                accessor: 'id',
                cell: (value: number) => (
                  <Button variant="danger" onClick={() => handleUninstallPlugin(value)}>
                    Uninstall
                  </Button>
                ),
              },
            ]}
            data={plugins}
          />
        </>
      )}
    </div>
  );
};

export default PluginManagementPage;