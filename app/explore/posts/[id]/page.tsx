// app/posts/[id]/page.tsx

'use client';

import React, {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useSession} from 'next-auth/react';
import Card from '../../../../components/Card';
import Button from '../../../../components/Button';
import Spinner from '../../../../components/Spinner';
import {formatDate} from '../../../../utils/dateUtils';
import {getImageUrl} from '../../../../utils/imageUtils';
import {Tag} from '../../../../types/tag';
import {User} from '@/lib/prisma';
import Link from 'next/link';
import Avatar from '../../../../components/Avatar';

interface Post {
  id: number;
  title: string;
  content: string;
  tags: Tag[];
  author: {
    id: string;
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
  const user = session?.user as User;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);

        if (response.ok) {
          const data = await response.json();
          setPost(data);
          console.log(data);
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

  const isAuthor = user?.id === post.author.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <div className="flex items-center mb-8">
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <Link href={`/profile/${post.author.id}`}>
          <Avatar src={post.author.avatar} alt={post.author.username} className="w-12 h-12 rounded-full mr-3" />
          </Link>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {post.author.username}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Posted on {formatDate(post.createdAt)}
            </p>
          </div>
          <div className="flex-1"/>
          <Button variant="outline-secondary" className='ml-4'>Follow post</Button>
        </div>
        <h1 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">{post.title}</h1>
        <div
            className="prose prose-lg dark:prose-dark max-w-none mb-8 text-gray-800 dark:text-white"
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
            {post.tags.length === 0 && <span>No tags</span>}
          </div>
        </div>
        <div className='flex justify-between mt-8'>
          <Button variant="primary" onClick={() => router.back()} className="h-10">
            All posts
          </Button>
        {isAuthor && (
            <div className="flex justify-end">
              <Button variant='secondary' className='text-white'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="thumbs-up-icon" width="24"
                     height="24">
                  <path
                      d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                </svg>
              </Button>
              <Button variant="secondary" onClick={handleEdit} className="mx-4">
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
        )}
        </div>
      </Card>
    </div>
  );
};

export default PostDetailPage;