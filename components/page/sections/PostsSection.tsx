'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import Card from '@/components/next-gen/Card';
import Spinner from '@/components/base/Spinner';

interface PostsSectionProps {
  section: any;
}

const PostsSection: React.FC<PostsSectionProps> = ({ section }) => {
  const { content } = section;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/posts', {
          params: {
            limit: content?.limit || 6,
            sortBy: content?.sortBy || 'createdAt',
            sortDirection: content?.sortDirection || 'desc',
            ...content?.filterBy
          }
        });
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [content]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {content?.title && (
        <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
      )}
      
      {content?.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {content.description}
        </p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <Card key={post.id} className="h-full flex flex-col">
            {post.featuredImage && (
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}
            
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {post.title}
                </Link>
              </h3>
              
              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              
              <div className="mt-auto text-sm text-gray-500 dark:text-gray-400">
                {post.createdAt && (
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                )}
                
                {post.author && (
                  <span className="ml-2">
                    by {post.author.name}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {content?.showViewAllLink && content?.viewAllUrl && (
        <div className="text-center mt-8">
          <Link 
            href={content.viewAllUrl}
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {content.viewAllText || 'View all posts'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostsSection;
