'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Button from '@/components/Button';
import Textarea from '@/components/Textarea';
import { useSession } from 'next-auth/react';

const CreateForumPostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const mdxSource = await serialize(content);

      const response = await fetch('/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content: mdxSource }),
      });

      if (response.ok) {
        router.push('/forum');
      } else {
        console.error('Error creating forum post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating forum post:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
        Create Forum Post
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-blue-600 dark:focus:border-blue-600"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block mb-2 font-medium text-gray-700 dark:text-gray-200"
          >
            Content
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>
        <Button type="submit">Create Post</Button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Preview</h2>
        <MDXRemote {...content} />
      </div>
    </div>
  );
};

export default CreateForumPostPage;