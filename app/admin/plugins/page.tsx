'use client';

import React, { useEffect, useState } from 'react';
import Table from '@/components/Table';
import Button from '@/components/Button';

interface Plugin {
  id: number;
  name: string;
  description: string;
  version: string;
  active: boolean;
}

const PluginManagementPage: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);

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

  const handleActivatePlugin = async (pluginId: number) => {
    try {
      const response = await fetch(`/api/admin/plugins/${pluginId}/activate`, {
        method: 'PUT',
      });

      if (response.ok) {
        setPlugins(
          plugins.map((plugin) => (plugin.id === pluginId ? { ...plugin, active: true } : plugin))
        );
      } else {
        console.error('Error activating plugin:', response.statusText);
      }
    } catch (error) {
      console.error('Error activating plugin:', error);
    }
  };

  const handleDeactivatePlugin = async (pluginId: number) => {
    try {
      const response = await fetch(`/api/admin/plugins/${pluginId}/deactivate`, {
        method: 'PUT',
      });

      if (response.ok) {
        setPlugins(
          plugins.map((plugin) => (plugin.id === pluginId ? { ...plugin, active: false } : plugin))
        );
      } else {
        console.error('Error deactivating plugin:', response.statusText);
      }
    } catch (error) {
      console.error('Error deactivating plugin:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
        Plugin Management
      </h1>
      <div className="mb-8">
        <Button onClick={handleInstallPlugin}>Install New Plugin</Button>
      </div>
      <Table
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Description', accessor: 'description' },
          { header: 'Version', accessor: 'version' },
          {
            header: 'Status',
            accessor: 'active',
            cell: (value: boolean) => (value ? 'Active' : 'Inactive'),
          },
          {
            header: 'Actions',
            accessor: 'id',
            cell: (value: number, row: Plugin) => (
              <>
                {row.active ? (
                  <Button variant="danger" onClick={() => handleDeactivatePlugin(value)}>
                    Deactivate
                  </Button>
                ) : (
                  <Button onClick={() => handleActivatePlugin(value)}>Activate</Button>
                )}
                <Button variant="danger" onClick={() => handleUninstallPlugin(value)}>
                  Uninstall
                </Button>
              </>
            ),
          } as any,
        ]}
        data={plugins}
      />
    </div>
  );
};

export default PluginManagementPage;