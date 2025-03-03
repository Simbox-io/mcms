// app/admin/navigation/[id]/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiArrowLeft, FiArrowUp, FiArrowDown, FiLink, FiExternalLink } from 'react-icons/fi';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import { Dialog } from '@/components/base/Dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { User } from '@/lib/prisma';

interface NavigationMenu {
  id: string;
  name: string;
  description: string | null;
  location: string;
  items: NavigationItem[];
}

interface NavigationItem {
  id: string;
  title: string;
  url: string | null;
  icon: string | null;
  order: number;
  openInNewTab: boolean;
  menuId: string;
  parentId: string | null;
  requiresAuth: boolean;
  requiredRole: string | null;
  isEnabled: boolean;
  targetModule: string | null;
  children?: NavigationItem[];
}

interface Module {
  id: string;
  name: string;
  slug: string;
  adminRoute: string | null;
}

const NavigationItemsPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();
  const [menu, setMenu] = useState<NavigationMenu | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<NavigationItem | null>(null);
  const [itemForm, setItemForm] = useState({
    title: '',
    url: '',
    icon: '',
    order: 0,
    openInNewTab: false,
    parentId: '',
    requiresAuth: false,
    requiredRole: '',
    isEnabled: true,
    targetModule: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchMenu();
    fetchModules();
  }, [session, status, router, user?.role, params.id]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/navigation/${params.id}`);
      setMenu(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to fetch menu', 
        variant: 'destructive' 
      });
      router.push('/admin/navigation');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await axios.get('/api/admin/modules');
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleAddItem = (parentId: string | null = null) => {
    setCurrentItem(null);
    setItemForm({
      title: '',
      url: '',
      icon: '',
      order: 0,
      openInNewTab: false,
      parentId: parentId || '',
      requiresAuth: false,
      requiredRole: '',
      isEnabled: true,
      targetModule: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: NavigationItem) => {
    setCurrentItem(item);
    setItemForm({
      title: item.title,
      url: item.url || '',
      icon: item.icon || '',
      order: item.order,
      openInNewTab: item.openInNewTab,
      parentId: item.parentId || '',
      requiresAuth: item.requiresAuth,
      requiredRole: item.requiredRole || '',
      isEnabled: item.isEnabled,
      targetModule: item.targetModule || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (item: NavigationItem) => {
    if (window.confirm(`Delete "${item.title}" item? This will remove all its children as well.`)) {
      try {
        await axios.delete(`/api/admin/navigation/items/${item.id}`);
        toast({ title: 'Success', description: 'Item deleted successfully' });
        fetchMenu(); // Refetch the whole menu to update the tree structure
      } catch (error) {
        console.error('Error deleting item:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to delete item', 
          variant: 'destructive' 
        });
      }
    }
  };

  const handleMoveItem = async (item: NavigationItem, direction: 'up' | 'down') => {
    // Find all items at the same level
    const siblings = menu?.items.filter(i => i.parentId === item.parentId) || [];
    const currentIndex = siblings.findIndex(i => i.id === item.id);
    
    if (direction === 'up' && currentIndex > 0) {
      const newOrder = siblings[currentIndex - 1].order;
      try {
        await axios.put(`/api/admin/navigation/items/${item.id}`, {
          order: newOrder,
        });
        fetchMenu();
      } catch (error) {
        console.error('Error moving item:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to move item', 
          variant: 'destructive' 
        });
      }
    } else if (direction === 'down' && currentIndex < siblings.length - 1) {
      const newOrder = siblings[currentIndex + 1].order;
      try {
        await axios.put(`/api/admin/navigation/items/${item.id}`, {
          order: newOrder,
        });
        fetchMenu();
      } catch (error) {
        console.error('Error moving item:', error);
        toast({ 
          title: 'Error', 
          description: 'Failed to move item', 
          variant: 'destructive' 
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentItem) {
        await axios.put(`/api/admin/navigation/items/${currentItem.id}`, itemForm);
        toast({ 
          title: 'Success', 
          description: 'Item updated successfully' 
        });
      } else {
        await axios.post(`/api/admin/navigation/${params.id}/items`, itemForm);
        toast({ 
          title: 'Success', 
          description: 'Item created successfully' 
        });
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (error) {
      console.error('Error saving item:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to save item', 
        variant: 'destructive' 
      });
    }
  };

  const renderItems = (items: NavigationItem[], level = 0) => {
    return items
      .filter(item => !item.parentId)
      .sort((a, b) => a.order - b.order)
      .map(item => (
        <div key={item.id} className="mb-2">
          <Card className={`p-3 border-l-4 ${level > 0 ? 'ml-6' : ''} ${item.isEnabled ? 'border-l-green-500' : 'border-l-gray-300'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {item.icon && <span className="text-xl">{item.icon}</span>}
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <div className="flex items-center text-sm text-gray-500">
                    {item.url && (
                      <span className="flex items-center mr-2">
                        <FiLink className="w-3 h-3 mr-1" />
                        {item.url.substring(0, 30)}{item.url.length > 30 ? '...' : ''}
                        {item.openInNewTab && <FiExternalLink className="w-3 h-3 ml-1" />}
                      </span>
                    )}
                    {item.targetModule && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded">
                        {item.targetModule}
                      </span>
                    )}
                    {item.requiresAuth && (
                      <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-0.5 rounded ml-1">
                        Auth {item.requiredRole ? `(${item.requiredRole})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handleMoveItem(item, 'up')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Move Up"
                >
                  <FiArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleMoveItem(item, 'down')}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Move Down"
                >
                  <FiArrowDown className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleAddItem(item.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Add Child Item"
                >
                  <FiPlus className="w-4 h-4 text-green-500" />
                </button>
                <button 
                  onClick={() => handleEditItem(item)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Edit Item"
                >
                  <FiEdit className="w-4 h-4 text-blue-500" />
                </button>
                <button 
                  onClick={() => handleDeleteItem(item)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Delete Item"
                >
                  <FiTrash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </Card>
          {item.children && item.children.length > 0 && (
            <div className="ml-6 mt-2 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
              {renderItems(item.children, level + 1)}
            </div>
          )}
        </div>
      ));
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center h-96"><Spinner size="large" /></div>;
  }

  if (!session || !(user?.role === 'ADMIN')) {
    return <EmptyState title="Unauthorized" description="You need to be an admin to access this page" />;
  }

  if (!menu) {
    return <EmptyState title="Menu Not Found" description="The requested navigation menu could not be found" />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push('/admin/navigation')} className="mr-4">
          <FiArrowLeft className="mr-2" /> Back to Menus
        </Button>
        <h1 className="text-2xl font-bold">{menu.name} Items</h1>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">
            Location: <span className="font-medium">{menu.location}</span>
            {menu.description && ` · ${menu.description}`}
          </p>
        </div>
        <Button variant="primary" onClick={() => handleAddItem()}>
          <FiPlus className="mr-2" /> Add Root Item
        </Button>
      </div>

      {menu.items.length === 0 ? (
        <Card>
          <EmptyState
            title="No Items Found"
            description="This menu doesn't have any items yet"
            action={
              <Button variant="primary" onClick={() => handleAddItem()}>
                Add Your First Item
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-2">
          {renderItems(menu.items)}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} title={`${isEditing ? 'Edit' : 'Add'} Navigation Item`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <Input
              value={itemForm.title}
              onChange={(e) => setItemForm({...itemForm, title: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">URL</label>
              <Input
                value={itemForm.url}
                onChange={(e) => setItemForm({...itemForm, url: e.target.value})}
                placeholder="e.g., /blog or https://example.com"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Icon</label>
              <Input
                value={itemForm.icon}
                onChange={(e) => setItemForm({...itemForm, icon: e.target.value})}
                placeholder="e.g., 📝 or icon class"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Parent Item</label>
              <select
                value={itemForm.parentId}
                onChange={(e) => setItemForm({...itemForm, parentId: e.target.value})}
                className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">No Parent (Root Item)</option>
                {menu.items
                  .filter(item => !currentItem || item.id !== currentItem.id)
                  .map(item => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Target Module</label>
              <select
                value={itemForm.targetModule}
                onChange={(e) => setItemForm({...itemForm, targetModule: e.target.value})}
                className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">None</option>
                {modules.map(module => (
                  <option key={module.id} value={module.slug}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Order</label>
              <Input
                type="number"
                value={itemForm.order}
                onChange={(e) => setItemForm({...itemForm, order: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Required Role</label>
              <Input
                value={itemForm.requiredRole}
                onChange={(e) => setItemForm({...itemForm, requiredRole: e.target.value})}
                placeholder="e.g., ADMIN or EDITOR"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={itemForm.isEnabled}
                onChange={(e) => setItemForm({...itemForm, isEnabled: e.target.checked})}
                className="w-4 h-4 rounded"
              />
              <span>Item Enabled</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={itemForm.openInNewTab}
                onChange={(e) => setItemForm({...itemForm, openInNewTab: e.target.checked})}
                className="w-4 h-4 rounded"
              />
              <span>Open in New Tab</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={itemForm.requiresAuth}
                onChange={(e) => setItemForm({...itemForm, requiresAuth: e.target.checked})}
                className="w-4 h-4 rounded"
              />
              <span>Requires Authentication</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">{isEditing ? 'Update' : 'Add'} Item</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default NavigationItemsPage;
