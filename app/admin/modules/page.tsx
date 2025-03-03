'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiToggleLeft, FiToggleRight, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import { Dialog } from '@/components/base/Dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { User } from '@/lib/prisma';

interface Module {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isEnabled: boolean;
  icon: string | null;
  settings: any;
  permissions: any;
  requiredRole: string | null;
  adminRoute: string | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const ModulesPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [moduleForm, setModuleForm] = useState({
    name: '',
    slug: '',
    description: '',
    isEnabled: true,
    icon: '',
    requiredRole: '',
    adminRoute: '',
    displayOrder: 0,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }

    fetchModules();
  }, [session, status, router, user?.role]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/modules');
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch modules.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (module: Module) => {
    try {
      await axios.put(`/api/admin/modules/${module.slug}`, {
        isEnabled: !module.isEnabled,
      });
      setModules(modules.map(m => m.id === module.id ? { ...m, isEnabled: !m.isEnabled } : m));
      toast({
        title: 'Success',
        description: `Module ${module.isEnabled ? 'disabled' : 'enabled'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling module status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update module status.',
        variant: 'destructive',
      });
    }
  };

  const handleEditModule = (module: Module) => {
    setCurrentModule(module);
    setModuleForm({
      name: module.name,
      slug: module.slug,
      description: module.description || '',
      isEnabled: module.isEnabled,
      icon: module.icon || '',
      requiredRole: module.requiredRole || '',
      adminRoute: module.adminRoute || '',
      displayOrder: module.displayOrder,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteModule = async (module: Module) => {
    if (window.confirm(`Are you sure you want to delete the ${module.name} module? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/admin/modules/${module.slug}`);
        setModules(modules.filter(m => m.id !== module.id));
        toast({
          title: 'Success',
          description: 'Module deleted successfully.',
        });
      } catch (error) {
        console.error('Error deleting module:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete module.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddModule = () => {
    setCurrentModule(null);
    setModuleForm({
      name: '',
      slug: '',
      description: '',
      isEnabled: true,
      icon: '',
      requiredRole: '',
      adminRoute: '',
      displayOrder: 0,
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setModuleForm({
      ...moduleForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentModule) {
        // Update existing module
        const response = await axios.put(`/api/admin/modules/${currentModule.slug}`, {
          ...moduleForm,
          newSlug: moduleForm.slug !== currentModule.slug ? moduleForm.slug : undefined,
        });
        setModules(modules.map(m => m.id === currentModule.id ? response.data : m));
        toast({
          title: 'Success',
          description: 'Module updated successfully.',
        });
      } else {
        // Create new module
        const response = await axios.post('/api/admin/modules', moduleForm);
        setModules([...modules, response.data]);
        toast({
          title: 'Success',
          description: 'Module created successfully.',
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving module:', error);
      toast({
        title: 'Error',
        description: 'Failed to save module.',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="large" />
      </div>
    );
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Module Management</h1>
        <Button variant="primary" onClick={handleAddModule}>
          <FiPlus className="mr-2" /> Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <Card>
          <EmptyState
            title="No Modules Found"
            description="You haven't added any modules yet."
            action={
              <Button variant="primary" onClick={handleAddModule}>
                Add Your First Module
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {modules.map((module) => (
            <Card key={module.id} className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {module.icon && <span className="text-xl">{module.icon}</span>}
                  <div>
                    <h3 className="text-lg font-semibold">{module.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {module.description || 'No description'}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {module.slug}
                      </span>
                      {module.requiredRole && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {module.requiredRole}
                        </span>
                      )}
                      <span
                        className={`text-xs ${
                          module.isEnabled
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        } px-2 py-1 rounded`}
                      >
                        {module.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleModule(module)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={module.isEnabled ? 'Disable Module' : 'Enable Module'}
                  >
                    {module.isEnabled ? (
                      <FiToggleRight className="w-6 h-6 text-green-500" />
                    ) : (
                      <FiToggleLeft className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEditModule(module)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Edit Module"
                  >
                    <FiEdit className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Delete Module"
                  >
                    <FiTrash className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={isEditing ? 'Edit Module' : 'Add New Module'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Module Name
            </label>
            <Input
              id="name"
              name="name"
              value={moduleForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="slug" className="block mb-1 font-medium">
              Slug
            </label>
            <Input
              id="slug"
              name="slug"
              value={moduleForm.slug}
              onChange={handleInputChange}
              required
              placeholder="unique-slug"
              pattern="^[a-z0-9-]+$"
              title="Slug must contain only lowercase letters, numbers, and hyphens"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used in URLs and as a unique identifier. Only lowercase letters, numbers, and hyphens.
            </p>
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <Input
              id="description"
              name="description"
              value={moduleForm.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="icon" className="block mb-1 font-medium">
                Icon
              </label>
              <Input
                id="icon"
                name="icon"
                value={moduleForm.icon}
                onChange={handleInputChange}
                placeholder="📦"
              />
            </div>
            <div>
              <label htmlFor="displayOrder" className="block mb-1 font-medium">
                Display Order
              </label>
              <Input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={moduleForm.displayOrder}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="requiredRole" className="block mb-1 font-medium">
                Required Role
              </label>
              <Input
                id="requiredRole"
                name="requiredRole"
                value={moduleForm.requiredRole}
                onChange={handleInputChange}
                placeholder="ADMIN"
              />
            </div>
            <div>
              <label htmlFor="adminRoute" className="block mb-1 font-medium">
                Admin Route
              </label>
              <Input
                id="adminRoute"
                name="adminRoute"
                value={moduleForm.adminRoute}
                onChange={handleInputChange}
                placeholder="/admin/module-name"
              />
            </div>
          </div>
          <div className="pt-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isEnabled"
                checked={moduleForm.isEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 rounded"
              />
              <span>Module Enabled</span>
            </label>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? 'Update' : 'Create'} Module
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default ModulesPage;
