'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Pagination from '@/components/Pagination';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
  };
  createdAt: string;
}

const PostListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?page=${currentPage}`);

        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching posts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePostClick = (postId: number) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">Home</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Recent News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id} onClick={() => handlePostClick(post.id)}>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{post.content}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </Card>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-8"
      />
    </div>
  );
};

export default PostListPage;