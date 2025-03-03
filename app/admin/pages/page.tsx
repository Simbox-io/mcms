'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiCalendar, FiUser, FiEye, FiEyeOff, FiHome } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@/lib/prisma';
import Badge from '@/components/next-gen/Badge';

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isPublished: boolean;
  isHomePage: boolean;
  layout: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
}

const PagesPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchPages();
  }, [session, status, router, user?.role]);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/pages');
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({ title: 'Error', description: 'Failed to fetch pages', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreatePage = useCallback(() => {
    router.push('/admin/pages/editor');
  }, [router]);

  const handleEditPage = useCallback((page: Page) => {
    router.push(`/admin/pages/editor?id=${page.id}`);
  }, [router]);

  const handleDeletePage = useCallback(async (page: Page) => {
    if (window.confirm(`Are you sure you want to delete "${page.title}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/admin/pages/${page.id}`);
        setPages(pages.filter(p => p.id !== page.id));
        toast({ title: 'Success', description: 'Page deleted successfully' });
      } catch (error) {
        console.error('Error deleting page:', error);
        toast({ title: 'Error', description: 'Failed to delete page', variant: 'destructive' });
      }
    }
  }, [pages, toast]);

  const handleTogglePublish = useCallback(async (page: Page) => {
    try {
      await axios.patch(`/api/admin/pages/${page.id}`, {
        isPublished: !page.isPublished
      });
      setPages(pages.map(p => p.id === page.id ? { ...p, isPublished: !p.isPublished } : p));
      toast({ 
        title: 'Success', 
        description: `Page ${!page.isPublished ? 'published' : 'unpublished'} successfully` 
      });
    } catch (error) {
      console.error('Error toggling page publish status:', error);
      toast({ title: 'Error', description: 'Failed to update page status', variant: 'destructive' });
    }
  }, [pages, toast]);

  const handleSetHomePage = useCallback(async (page: Page) => {
    if (page.isHomePage) return; // Already home page
    
    if (window.confirm(`Set "${page.title}" as the home page? This will replace the current home page.`)) {
      try {
        await axios.patch(`/api/admin/pages/${page.id}`, {
          isHomePage: true
        });
        
        // Update local state - only one page can be home page
        setPages(pages.map(p => ({
          ...p,
          isHomePage: p.id === page.id
        })));
        
        toast({ title: 'Success', description: 'Home page updated successfully' });
      } catch (error) {
        console.error('Error setting home page:', error);
        toast({ title: 'Error', description: 'Failed to set home page', variant: 'destructive' });
      }
    }
  }, [pages, toast]);

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Pages" description="Manage your website pages">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="primary" onClick={handleCreatePage} className="whitespace-nowrap">
            <FiPlus className="mr-2" /> New Page
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="large" />
          </div>
        ) : filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredPages.map((page) => (
              <Card key={page.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{page.title}</h3>
                      <div className="ml-2 flex space-x-2">
                        {page.isHomePage && (
                          <Badge variant="success">
                            <FiHome className="mr-1" /> Home
                          </Badge>
                        )}
                        {page.isPublished ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="warning">Draft</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      /{page.slug}
                    </p>
                    {page.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {page.description}
                      </p>
                    )}
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center mr-3">
                        <FiCalendar className="mr-1" />
                        Created {formatDistanceToNow(new Date(page.createdAt), { addSuffix: true })}
                      </span>
                      <span className="inline-flex items-center mr-3">
                        <FiUser className="mr-1" />
                        {page.author?.name || 'Unknown'}
                      </span>
                      <span className="inline-flex items-center">
                        <FiCalendar className="mr-1" />
                        Updated {formatDistanceToNow(new Date(page.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleTogglePublish(page)}
                    >
                      {page.isPublished ? (
                        <><FiEyeOff className="mr-1" /> Unpublish</>
                      ) : (
                        <><FiEye className="mr-1" /> Publish</>
                      )}
                    </Button>
                    {!page.isHomePage && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetHomePage(page)}
                      >
                        <FiHome className="mr-1" /> Set as Home
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEditPage(page)}>
                      <FiEdit className="mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePage(page)}>
                      <FiTrash className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No pages found"
            description={searchTerm ? "Try adjusting your search" : "Get started by creating your first page"}
            action={
              <Button variant="primary" onClick={handleCreatePage}>
                <FiPlus className="mr-2" /> Create Page
              </Button>
            }
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PagesPage;
