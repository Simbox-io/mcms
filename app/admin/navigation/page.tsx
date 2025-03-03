'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiEye, FiEyeOff, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import Dialog from '@/components/base/Dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { User } from '@/lib/prisma';

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
  location: string; // 'header', 'footer', 'sidebar', etc.
}

const NavigationPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
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
    requiresAuth: false,
    requiredRole: '',
    isEnabled: true,
    location: 'header',
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchNavItems();
  }, [session, status, router, user?.role]);

  const fetchNavItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/navigation/items');
      // Sort by location and then by order
      const sortedItems = response.data.sort((a: NavigationItem, b: NavigationItem) => {
        if (a.location !== b.location) {
          return a.location.localeCompare(b.location);
        }
        return a.order - b.order;
      });
      setNavItems(sortedItems);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
      toast({ title: 'Error', description: 'Failed to fetch navigation items', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleEditItem = useCallback((item: NavigationItem) => {
    setCurrentItem(item);
    setItemForm({
      title: item.title,
      url: item.url || '',
      icon: item.icon || '',
      order: item.order,
      openInNewTab: item.openInNewTab,
      requiresAuth: item.requiresAuth,
      requiredRole: item.requiredRole || '',
      isEnabled: item.isEnabled,
      location: item.location,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  }, []);

  const handleDeleteItem = useCallback(async (item: NavigationItem) => {
    if (window.confirm(`Delete "${item.title}" navigation item?`)) {
      try {
        await axios.delete(`/api/admin/navigation/items/${item.id}`);
        setNavItems(navItems.filter(i => i.id !== item.id));
        toast({ title: 'Success', description: 'Navigation item deleted successfully' });
      } catch (error) {
        console.error('Error deleting navigation item:', error);
        toast({ title: 'Error', description: 'Failed to delete navigation item', variant: 'destructive' });
      }
    }
  }, [navItems, toast]);

  const handleAddItem = useCallback(() => {
    setCurrentItem(null);
    setItemForm({
      title: '',
      url: '',
      icon: '',
      order: navItems.length + 1,
      openInNewTab: false,
      requiresAuth: false,
      requiredRole: '',
      isEnabled: true,
      location: 'header',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  }, [navItems.length]);

  const handleToggleVisibility = useCallback(async (item: NavigationItem) => {
    try {
      const updatedItem = { ...item, isEnabled: !item.isEnabled };
      const response = await axios.put(`/api/admin/navigation/items/${item.id}`, updatedItem);
      setNavItems(navItems.map(i => i.id === item.id ? response.data : i));
      toast({ 
        title: 'Success', 
        description: `Navigation item ${updatedItem.isEnabled ? 'visible' : 'hidden'}`
      });
    } catch (error) {
      console.error('Error updating item visibility:', error);
      toast({ title: 'Error', description: 'Failed to update item visibility', variant: 'destructive' });
    }
  }, [navItems, toast]);

  const handleMoveItem = useCallback(async (item: NavigationItem, direction: 'up' | 'down') => {
    // Find items in the same location
    const itemsInSameLocation = navItems.filter(i => i.location === item.location);
    const itemIndex = itemsInSameLocation.findIndex(i => i.id === item.id);
    
    if ((direction === 'up' && itemIndex === 0) || 
        (direction === 'down' && itemIndex === itemsInSameLocation.length - 1)) {
      return; // Can't move further in this direction
    }
    
    const newItems = [...navItems];
    const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
    const targetItem = itemsInSameLocation[targetIndex];
    
    // Swap orders
    const tempOrder = item.order;
    const updatedItem = { ...item, order: targetItem.order };
    const updatedTargetItem = { ...targetItem, order: tempOrder };
    
    try {
      await Promise.all([
        axios.put(`/api/admin/navigation/items/${item.id}`, updatedItem),
        axios.put(`/api/admin/navigation/items/${targetItem.id}`, updatedTargetItem)
      ]);
      
      setNavItems(navItems.map(i => {
        if (i.id === item.id) return updatedItem;
        if (i.id === targetItem.id) return updatedTargetItem;
        return i;
      }));
      
      toast({ title: 'Success', description: 'Navigation order updated' });
    } catch (error) {
      console.error('Error updating item order:', error);
      toast({ title: 'Error', description: 'Failed to update item order', variant: 'destructive' });
    }
  }, [navItems, toast]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentItem) {
        const response = await axios.put(`/api/admin/navigation/items/${currentItem.id}`, itemForm);
        setNavItems(navItems.map(item => item.id === currentItem.id ? response.data : item));
        toast({ title: 'Success', description: 'Navigation item updated successfully' });
      } else {
        const response = await axios.post('/api/admin/navigation/items', itemForm);
        setNavItems([...navItems, response.data]);
        toast({ title: 'Success', description: 'Navigation item created successfully' });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving navigation item:', error);
      toast({ title: 'Error', description: 'Failed to save navigation item', variant: 'destructive' });
    }
  }, [isEditing, currentItem, itemForm, navItems, toast]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setItemForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
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
        <h1 className="text-2xl font-bold">Navigation Management</h1>
        <Button variant="primary" onClick={handleAddItem}>
          <FiPlus className="mr-2" /> Add Menu Item
        </Button>
      </div>

      {navItems.length === 0 ? (
        <Card>
          <EmptyState
            title="No Navigation Items Found"
            description="No navigation items have been created yet."
            action={
              <Button variant="primary" onClick={handleAddItem}>
                Add Your First Navigation Item
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {['header', 'footer', 'sidebar'].map(location => {
            const itemsInLocation = navItems.filter(item => item.location === location);
            if (itemsInLocation.length === 0) return null;
            
            return (
              <Card key={location} className="overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800">
                  <h2 className="text-lg font-semibold capitalize">{location} Navigation</h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {itemsInLocation.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {item.icon && <span className="text-xl">{item.icon}</span>}
                        <div>
                          <h3 className="text-lg font-semibold">
                            {item.title}
                            {!item.isEnabled && (
                              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                Hidden
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.url || 'No URL'}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            {item.requiresAuth && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                Auth Required
                              </span>
                            )}
                            {item.requiredRole && (
                              <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                                Role: {item.requiredRole}
                              </span>
                            )}
                            {item.openInNewTab && (
                              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                New Tab
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(item)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title={item.isEnabled ? 'Hide Item' : 'Show Item'}
                        >
                          {item.isEnabled ? (
                            <FiEye className="w-5 h-5 text-green-500" />
                          ) : (
                            <FiEyeOff className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleMoveItem(item, 'up')}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Move Up"
                          disabled={itemsInLocation.indexOf(item) === 0}
                        >
                          <FiArrowUp className={`w-5 h-5 ${itemsInLocation.indexOf(item) === 0 ? 'text-gray-400' : 'text-blue-500'}`} />
                        </button>
                        <button
                          onClick={() => handleMoveItem(item, 'down')}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Move Down"
                          disabled={itemsInLocation.indexOf(item) === itemsInLocation.length - 1}
                        >
                          <FiArrowDown className={`w-5 h-5 ${itemsInLocation.indexOf(item) === itemsInLocation.length - 1 ? 'text-gray-400' : 'text-blue-500'}`} />
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Edit Item"
                        >
                          <FiEdit className="w-5 h-5 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Delete Item"
                        >
                          <FiTrash className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Navigation Item' : 'Add Navigation Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={itemForm.title}
              onChange={(value) => setItemForm({...itemForm, title: value})}
              required
            />
          </div>
          <div>
            <label htmlFor="url" className="block mb-1 font-medium">
              URL
            </label>
            <Input
              id="url"
              name="url"
              value={itemForm.url}
              onChange={(value) => setItemForm({...itemForm, url: value})}
              required
              placeholder="/page-path"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="icon" className="block mb-1 font-medium">
                Icon (emoji)
              </label>
              <Input
                id="icon"
                name="icon"
                value={itemForm.icon}
                onChange={(value) => setItemForm({...itemForm, icon: value})}
                placeholder="📄"
              />
            </div>
            <div>
              <label htmlFor="location" className="block mb-1 font-medium">
                Location
              </label>
              <select
                id="location"
                name="location"
                value={itemForm.location}
                onChange={(e) => setItemForm({...itemForm, location: e.target.value})}
                className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
              >
                <option value="header">Header</option>
                <option value="footer">Footer</option>
                <option value="sidebar">Sidebar</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="order" className="block mb-1 font-medium">
                Display Order
              </label>
              <Input
                id="order"
                name="order"
                type="number"
                value={itemForm.order.toString()}
                onChange={(value) => setItemForm({...itemForm, order: parseInt(value, 10) || 0})}
              />
            </div>
            <div>
              <label htmlFor="requiredRole" className="block mb-1 font-medium">
                Required Role
              </label>
              <Input
                id="requiredRole"
                name="requiredRole"
                value={itemForm.requiredRole}
                onChange={(value) => setItemForm({...itemForm, requiredRole: value})}
                placeholder="ADMIN or USER"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                id="isEnabled"
                name="isEnabled"
                type="checkbox"
                checked={itemForm.isEnabled}
                onChange={(e) => setItemForm({...itemForm, isEnabled: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Visible on site
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="openInNewTab"
                name="openInNewTab"
                type="checkbox"
                checked={itemForm.openInNewTab}
                onChange={(e) => setItemForm({...itemForm, openInNewTab: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="openInNewTab" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Open in new tab
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="requiresAuth"
                name="requiresAuth"
                type="checkbox"
                checked={itemForm.requiresAuth}
                onChange={(e) => setItemForm({...itemForm, requiresAuth: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requiresAuth" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Requires authentication
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default NavigationPage;
