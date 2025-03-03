'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import AdminLayout from '@/components/admin/AdminLayout';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Spinner from '@/components/base/Spinner';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/prisma';

// Import Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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

const QuillPostEditor = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!postId);

  // Fetch post data if editing an existing post
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(user?.role === 'ADMIN')) {
      router.push('/login');
      return;
    }

    if (postId) {
      const fetchPost = async () => {
        try {
          setInitialLoading(true);
          const response = await axios.get(`/api/admin/quill-posts/${postId}`);
          const post = response.data;
          setTitle(post.title);
          setContent(post.content);
        } catch (error) {
          console.error('Error fetching post:', error);
          toast({ title: 'Error', description: 'Failed to fetch post data', variant: 'destructive' });
        } finally {
          setInitialLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId, session, status, router, user?.role, toast]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    if (!content.trim() || content === '<p><br></p>') {
      toast({ title: 'Error', description: 'Content is required', variant: 'destructive' });
      return;
    }

    try {
      setSaving(true);
      if (postId) {
        // Update existing post
        await axios.patch(`/api/admin/quill-posts/${postId}`, {
          title,
          content
        });
        toast({ title: 'Success', description: 'Post updated successfully' });
      } else {
        // Create new post
        await axios.post('/api/admin/quill-posts', {
          title,
          content
        });
        toast({ title: 'Success', description: 'Post created successfully' });
      }
      router.push('/admin/quill-posts');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({ title: 'Error', description: 'Failed to save post', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }, [title, content, postId, router, toast]);

  const handleCancel = useCallback(() => {
    router.push('/admin/quill-posts');
  }, [router]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      ['code-block']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align',
    'color', 'background',
    'code-block'
  ];

  if (initialLoading) {
    return (
      <AdminLayout title="Quill Post Editor" description="Create or edit a post with the Quill editor">
        <div className="flex justify-center items-center h-64">
          <Spinner size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={postId ? 'Edit Quill Post' : 'Create Quill Post'} description="Create rich content with the Quill editor">
      <Card className="p-6">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Post Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <div className="bg-white dark:bg-gray-800 rounded-md">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              className="h-96 mb-12"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Spinner size="small" className="mr-2" />
                {postId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              postId ? 'Update Post' : 'Create Post'
            )}
          </Button>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default QuillPostEditor;
