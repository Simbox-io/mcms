// app/tags/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '../../../components/Card';
import Spinner from '../../../components/Spinner';
import { useToken } from '../../../lib/useToken';

interface Tag {
  id: number;
  name: string;
  posts: {
    id: number;
    title: string;
  }[];
  files: {
    id: number;
    name: string;
  }[];
}

const TagDetailPage: React.FC = () => {
  const { id } = useParams();
  const [tag, setTag] = useState<Tag | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useToken();

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch(`/api/tags/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTag(data);
        } else {
          console.error('Error fetching tag:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tag:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchTag();
    }
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!tag) {
    return <div>Tag not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">{tag.name}</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Posts</h2>
        {tag.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tag.posts.map((post) => (
              <Card key={post.id}>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{post.title}</h3>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Files</h2>
        {tag.files.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tag.files.map((file) => (
              <Card key={file.id}>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{file.name}</h3>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No files found.</p>
        )}
      </div>
    </div>
  );
};

export default TagDetailPage;