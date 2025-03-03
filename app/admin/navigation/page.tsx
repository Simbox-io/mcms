// app/admin/navigation/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiMenu, FiChevronRight } from 'react-icons/fi';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import Dialog from '@/components/base/Dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { User } from '@/lib/prisma';

interface NavigationMenu {
  id: string;
  name: string;
  description?: string;
  location: string;
  items: NavigationItem[];
  createdAt: string;
  updatedAt: string;
}

interface NavigationItem {
  id: string;
  title: string;
  url?: string;
  icon?: string;
  order: number;
  openInNewTab: boolean;
  requiresAuth: boolean;
  requiredRole?: string;
  isEnabled: boolean;
  targetModule?: string;
}

const NavigationPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<NavigationMenu | null>(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    location: 'header',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchMenus();
  }, [session, status, router, user?.role]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/navigation');
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      toast({ title: 'Error', description: 'Failed to fetch menus', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMenu = (menu: NavigationMenu) => {
    setCurrentMenu(menu);
    setMenuForm({
      name: menu.name,
      description: menu.description || '',
      location: menu.location,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteMenu = async (menu: NavigationMenu) => {
    if (window.confirm(`Delete ${menu.name} menu? This will remove all associated items.`)) {
      try {
        await axios.delete(`/api/admin/navigation/${menu.id}`);
        setMenus(menus.filter(m => m.id !== menu.id));
        toast({ title: 'Success', description: 'Menu deleted successfully' });
      } catch (error) {
        console.error('Error deleting menu:', error);
        toast({ title: 'Error', description: 'Failed to delete menu', variant: 'destructive' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentMenu) {
        const response = await axios.put(`/api/admin/navigation/${currentMenu.id}`, menuForm);
        setMenus(menus.map(m => m.id === currentMenu.id ? response.data : m));
      } else {
        const response = await axios.post('/api/admin/navigation', menuForm);
        setMenus([...menus, response.data]);
      }
      setIsModalOpen(false);
      toast({ title: 'Success', description: `Menu ${isEditing ? 'updated' : 'created'} successfully` });
    } catch (error) {
      console.error('Error saving menu:', error);
      toast({ title: 'Error', description: 'Failed to save menu', variant: 'destructive' });
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-96"><Spinner size="large" /></div>;
  }

  if (!session || !(user?.role === 'ADMIN')) {
    return <EmptyState title="Unauthorized" description="You need to be an admin to access this page" />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Navigation Management</h1>
        <Button variant="primary" onClick={() => {
          setMenuForm({ name: '', description: '', location: 'header' });
          setIsEditing(false);
          setIsModalOpen(true);
        }}>
          <FiPlus className="mr-2" /> Add Menu
        </Button>
      </div>

      {menus.length === 0 ? (
        <Card>
          <EmptyState
            title="No Menus Found"
            description="Create your first navigation menu to get started"
            action={<Button variant="primary" onClick={() => setIsModalOpen(true)}>Create Menu</Button>}
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {menus.map(menu => (
            <Card key={menu.id} className="p-0">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FiMenu className="w-5 h-5 text-gray-500" />
                  <div>
                    <h3 className="font-semibold">{menu.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {menu.location} · {menu.items.length} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => router.push(`/admin/navigation/${menu.id}`)}>
                    Manage Items <FiChevronRight className="ml-1" />
                  </Button>
                  <button onClick={() => handleEditMenu(menu)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <FiEdit className="w-5 h-5 text-blue-500" />
                  </button>
                  <button onClick={() => handleDeleteMenu(menu)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    <FiTrash className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${isEditing ? 'Edit' : 'Create'} Menu`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input
              value={menuForm.name}
              onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <Input
              value={menuForm.description}
              onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <select
              value={menuForm.location}
              onChange={(e) => setMenuForm({...menuForm, location: e.target.value})}
              className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Update' : 'Create'} Menu</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default NavigationPage;
