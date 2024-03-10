// app/posts/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Spinner from '../../../components/Spinner';
import { formatDate } from '../../../utils/dateUtils';
import { getImageUrl } from '../../../utils/imageUtils';
import { useRouter } from 'next/navigation';
import { Tag } from '../../../types/tag';

interface Post {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  author: {
    id: number;
    username: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);

        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          console.error('Error fetching post:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = () => {
    router.push(`/posts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/posts');
      } else {
        console.error('Error deleting post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!post) {
    return <div>Post not found.</div>;
  }

  const isAuthor = session?.user?.email === post.author.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <div className="flex items-center mb-8">
          <img
            src={getImageUrl(post.author.avatar)}
            alt={post.author.username}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {post.author.username}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Posted on {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">{post.title}</h1>
        <div
          className="prose prose-lg dark:prose-dark max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
        {isAuthor && (
          <div className="flex justify-end mt-8">
            <Button variant="secondary" onClick={handleEdit} className="mr-2">
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PostDetailPage;