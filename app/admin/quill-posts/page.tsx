'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiCalendar, FiUser } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@/lib/prisma';

interface QuillPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
}

const QuillPostsPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<QuillPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchPosts();
  }, [session, status, router, user?.role]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/quill-posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching quill posts:', error);
      toast({ title: 'Error', description: 'Failed to fetch quill posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCreatePost = useCallback(() => {
    router.push('/admin/quill-posts/editor');
  }, [router]);

  const handleEditPost = useCallback((post: QuillPost) => {
    router.push(`/admin/quill-posts/editor?id=${post.id}`);
  }, [router]);

  const handleDeletePost = useCallback(async (post: QuillPost) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/admin/quill-posts/${post.id}`);
        setPosts(posts.filter(p => p.id !== post.id));
        toast({ title: 'Success', description: 'Post deleted successfully' });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
      }
    }
  }, [posts, toast]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Quill Posts" description="Manage your Quill editor posts">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="primary" onClick={handleCreatePost} className="whitespace-nowrap">
            <FiPlus className="mr-2" /> New Quill Post
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="large" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{post.title}</h3>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center mr-3">
                        <FiCalendar className="mr-1" />
                        Created {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                      <span className="inline-flex items-center mr-3">
                        <FiUser className="mr-1" />
                        {post.author.name}
                      </span>
                      <span className="inline-flex items-center">
                        <FiCalendar className="mr-1" />
                        Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                      <FiEdit className="mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post)}>
                      <FiTrash className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Quill posts found"
            description={searchTerm ? "Try adjusting your search" : "Get started by creating your first Quill post"}
            action={
              <Button variant="primary" onClick={handleCreatePost}>
                <FiPlus className="mr-2" /> Create Quill Post
              </Button>
            }
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default QuillPostsPage;
