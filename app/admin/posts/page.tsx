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
import Dialog from '@/components/base/Dialog';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/EmptyState';
import { User } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

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
        <h1 className="text-2xl font-bold">Posts Management</h1>
        <Button variant="primary" onClick={handleCreatePost}>
          <FiPlus className="mr-2" /> Create New Post
        </Button>
      </div>

      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <Input
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              placeholder="Search posts..."
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </Card>

      {filteredPosts.length === 0 ? (
        <Card>
          <EmptyState
            title="No Posts Found"
            description={searchTerm || selectedCategory || selectedStatus
              ? "No posts match your filters. Try changing your search criteria."
              : "You haven't created any posts yet."}
            action={
              <Button variant="primary" onClick={handleCreatePost}>
                Create Your First Post
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-0">
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <div className="flex-grow mb-2 sm:mb-0">
                  <div className="flex items-start">
                    {post.featuredImage && (
                      <div className="w-16 h-16 rounded overflow-hidden mr-4 flex-shrink-0">
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">
                        {post.title}
                        {post.isFeatured && (
                          <span className="ml-2 text-yellow-500">
                            <FiStar className="inline-block h-4 w-4" />
                          </span>
                        )}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center mt-2 text-xs space-x-3">
                        <span className={`px-2 py-1 rounded ${getStatusBadgeClass(post.status)}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 flex items-center">
                          <FiCalendar className="mr-1" /> 
                          {post.publishedAt 
                            ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                            : formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </span>
                        {post.category && (
                          <span className="text-gray-500 dark:text-gray-400 flex items-center">
                            <FiFolder className="mr-1" /> {post.category.name}
                          </span>
                        )}
                        <span className="text-gray-500 dark:text-gray-400 flex items-center">
                          <FiMessageSquare className="mr-1" /> {post.commentCount} comments
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {post.views} views
                        </span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {post.tags.map(({ tag }) => (
                            <span key={tag.slug} className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex items-center">
                              <FiTag className="mr-1 h-3 w-3" /> {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewPost(post)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="View Post"
                  >
                    <FiEye className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(post)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={post.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                  >
                    <FiStar className={`w-5 h-5 ${post.isFeatured ? 'text-yellow-500' : 'text-gray-500'}`} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(post)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={post.status === 'published' ? "Set to Draft" : "Publish"}
                  >
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusBadgeClass(post.status)}`}>
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleEditPost(post)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Edit Post"
                  >
                    <FiEdit className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(post)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Delete Post"
                  >
                    <FiTrash className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPage;