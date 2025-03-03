'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiEdit, FiTrash, FiPlus, FiEye, FiStar, FiCalendar, FiTag, FiFolder, FiMessageSquare } from 'react-icons/fi';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { formatDistanceToNow } from 'date-fns';
import AdminLayout from '@/components/admin/AdminLayout';
import { User } from '@/lib/prisma';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: string;
  categoryId?: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'password_protected';
  publishedAt?: string;
  isFeatured: boolean;
  allowComments: boolean;
  views: number;
  likes: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags: {
    tag: {
      name: string;
      slug: string;
    };
  }[];
  commentCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

const PostsPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, [session, status, router, user?.role]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({ title: 'Error', description: 'Failed to fetch posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({ title: 'Error', description: 'Failed to fetch categories', variant: 'destructive' });
    }
  }, [toast]);

  const fetchTags = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast({ title: 'Error', description: 'Failed to fetch tags', variant: 'destructive' });
    }
  }, [toast]);

  const handleCreatePost = useCallback(() => {
    router.push('/admin/posts/editor');
  }, [router]);

  const handleEditPost = useCallback((post: Post) => {
    router.push(`/admin/posts/editor?id=${post.id}`);
  }, [router]);

  const handleViewPost = useCallback((post: Post) => {
    window.open(`/blog/${post.slug}`, '_blank');
  }, []);

  const handleDeletePost = useCallback(async (post: Post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/admin/posts/${post.id}`);
        setPosts(posts.filter(p => p.id !== post.id));
        toast({ title: 'Success', description: 'Post deleted successfully' });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
      }
    }
  }, [posts, toast]);

  const handleToggleFeatured = useCallback(async (post: Post) => {
    try {
      const response = await axios.patch(`/api/admin/posts/${post.id}`, {
        isFeatured: !post.isFeatured
      });
      setPosts(posts.map(p => p.id === post.id ? { ...p, isFeatured: !p.isFeatured } : p));
      toast({ 
        title: 'Success', 
        description: `Post ${response.data.isFeatured ? 'marked as featured' : 'removed from featured'}`
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({ title: 'Error', description: 'Failed to update post', variant: 'destructive' });
    }
  }, [posts, toast]);

  const handleToggleStatus = useCallback(async (post: Post) => {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      const response = await axios.patch(`/api/admin/posts/${post.id}`, {
        status: newStatus,
        publishedAt: newStatus === 'published' ? new Date().toISOString() : null
      });
      setPosts(posts.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
      toast({ 
        title: 'Success', 
        description: `Post ${newStatus === 'published' ? 'published' : 'set to draft'}`
      });
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({ title: 'Error', description: 'Failed to update post status', variant: 'destructive' });
    }
  }, [posts, toast]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    }
  };

  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(post => selectedCategory ? post.categoryId === selectedCategory : true)
    .filter(post => selectedStatus ? post.status === selectedStatus : true);

  return (
    <AdminLayout title="Posts" description="Manage your blog posts">
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
          <div className="flex flex-col md:flex-row gap-2">
            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Button variant="primary" onClick={handleCreatePost} className="whitespace-nowrap">
              <FiPlus className="mr-2" /> New Post
            </Button>
          </div>
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
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{post.title}</h3>
                      {post.isFeatured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          <FiStar className="mr-1" /> Featured
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(post.status)}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center mr-3">
                        <FiCalendar className="mr-1" />
                        {post.publishedAt 
                          ? `Published ${formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}` 
                          : `Created ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}`}
                      </span>
                      {post.category && (
                        <span className="inline-flex items-center mr-3">
                          <FiFolder className="mr-1" />
                          {post.category.name}
                        </span>
                      )}
                      <span className="inline-flex items-center mr-3">
                        <FiMessageSquare className="mr-1" />
                        {post.commentCount} comments
                      </span>
                      {post.tags.length > 0 && (
                        <span className="inline-flex items-center">
                          <FiTag className="mr-1" />
                          {post.tags.map(t => t.tag.name).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewPost(post)}>
                      <FiEye className="mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                      <FiEdit className="mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleFeatured(post)}>
                      <FiStar className="mr-1" /> {post.isFeatured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggleStatus(post)}>
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
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
            title="No posts found"
            description={searchTerm || selectedCategory || selectedStatus ? "Try adjusting your filters" : "Get started by creating your first post"}
            action={
              <Button variant="primary" onClick={handleCreatePost}>
                <FiPlus className="mr-2" /> Create Post
              </Button>
            }
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default PostsPage;