'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/next-gen/Button';
import Input from '@/components/next-gen/Input';
import Textarea from '@/components/next-gen/Textarea';
import Select from '@/components/next-gen/Select';
import Spinner from '@/components/next-gen/Spinner';
import { motion } from 'framer-motion';

const CreatePagePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [spaceId, setSpaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!title || !content || !spaceId) {
      setError('Please fill in all the required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      //const newPage = await createPage({ title, content, spaceId });
      const newPage = { id: 1 };
      router.push(`/pages/${newPage.id}`);
    } catch (error) {
      console.error('Error creating page:', error);
      setError('An error occurred while creating the page. Please try again.');
    }

    setLoading(false);
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="container mx-auto px-4 py-8"
  >
    <h1 className="text-4xl font-bold mb-8 text-center">Create New Page</h1>
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={() => handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
            Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(value) => setTitle(value)}
            required
            className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter page title"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="content" className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
            Content
          </label>
          <Textarea
            value={content}
            onChange={(value) => setContent(value)}
            rows={8}
            className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter page content"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="spaceId" className="block mb-2 font-bold text-gray-700 dark:text-gray-200">
            Space
          </label>
          <Select
            value={spaceId}
            onChange={(value) => setSpaceId(value)}
            options={[
              { value: '', label: 'Select a space' },
              { value: 'space1', label: 'Space 1' },
              { value: 'space2', label: 'Space 2' },
              { value: 'space3', label: 'Space 3' },
            ]}
            className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-lg dark:border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-500 mb-6"
          >
            {error}
          </motion.p>
        )}
        <Button
          variant="primary"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? <Spinner size="small" /> : 'Create Page'}
        </Button>
      </form>
    </div>
  </motion.div>
  );
};

export default CreatePagePage;