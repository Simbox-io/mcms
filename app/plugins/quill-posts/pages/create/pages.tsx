// app/plugins/quill-posts/pages/create/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Editor from '../../components/Editor';
import Button from '@/components/Button';
import { User } from '@/lib/prisma';

const CreateQuillPostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/plugins/quill-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.ok) {
        router.push('/plugins/quill-posts');
      } else {
        console.error('Error creating Quill post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating Quill post:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Create Quill Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-semibold text-gray-800 dark:text-white">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2 font-semibold text-gray-800 dark:text-white">
            Content
          </label>
          <Editor value={content} onChange={setContent} />
        </div>
        <Button type="submit">Create Quill Post</Button>
      </form>
    </div>
  );
};

export default CreateQuillPostPage;