'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/base/Card';
import ProjectCard from '@/components/ProjectCard';
import FileCard from '@/components/FileCard';
import SpaceCard from '@/components/SpaceCard';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import { User } from '@/lib/prisma';
import { useSession } from "next-auth/react";
import { File, Post, Project, Space } from '@/lib/prisma';
import { motion } from 'framer-motion';
import ShareButton from '@/components/ShareButton';
import BookmarkButton from '@/components/BookmarkButton';
import SubscribeButton from '@/components/SubscribeButton';
import BadgeIcon from '@/components/icons/BadgeIcon';
import LeaderboardIcon from '@/components/icons/LeaderboardIcon';
import MasonryGrid from '@/components/MasonryGrid';
import Tabs from '@/components/Tabs';
import Avatar from '@/components/base/Avatar';
import CommentsIcon from '@/components/icons/CommentsIcon';
import ThumbUpIcon from '@/components/icons/ThumbUpIcon';

const HomePage: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<(Post | Project | File | Space)[]>([]);
  const [trendingItems, setTrendingItems] = useState<(Post | Project | File | Space)[]>([]);
  const [recommendedItems, setRecommendedItems] = useState<(Post | Project | File | Space)[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const user = session?.user as User;
  const router = useRouter();
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [postsResponse, projectsResponse, filesResponse, spacesResponse] = await Promise.all([
          fetch('/api/posts?page=1&featured=true'),
          fetch('/api/projects?page=1&featured=true'),
          fetch('/api/files?page=1&featured=true'),
          fetch('/api/spaces?page=1&featured=true'),
        ]);

        const [postsData, projectsData, filesData, spacesData] = await Promise.all([
          postsResponse.json(),
          projectsResponse.json(),
          filesResponse.json(),
          spacesResponse.json(),
        ]);

        const featuredPosts = postsData.posts.map((post: Post) => ({ ...post, type: 'post' }));
        const featuredProjects = projectsData.projects.map((project: Project) => ({ ...project, type: 'project' }));
        const featuredFiles = filesData.files.map((file: File) => ({ ...file, type: 'file' }));
        const featuredSpaces = spacesData.spaces.map((space: Space) => ({ ...space, type: 'space' }));

        const allFeaturedItems = [...featuredPosts, ...featuredProjects, ...featuredFiles, ...featuredSpaces];
        setFeaturedItems(allFeaturedItems);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleBookmark = async (itemId: string, itemType: string) => {
    try {
      await fetch(`/api/bookmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id, itemId, itemType }),
      });
      // Update the UI to reflect the bookmarked state
    } catch (error) {
      console.error('Error bookmarking item:', error);
    }
  };

  const handleSubscribe = async (itemId: string, itemType: string) => {
    try {
      await fetch(`/api/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id, itemId, itemType }),
      });
      // Update the UI to reflect the subscribed state
    } catch (error) {
      console.error('Error subscribing to item:', error);
    }
  };

  const renderItem = (item: Post | Project | File | Space) => {
    switch (item.type) {
      case 'post':
        return (
          <Card
            effects={false}
            headerClassName='border-hidden'
            header={
              <div className="flex flex-col justify-between items-left h-8">
                <div className='flex content-center items-center h-12'>
                <Avatar src={item.author.avatar || ''} size='small' />
                  <span className='ml-4'>{item.author.username}</span>
                  <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-200">{item.title}</h2>
                
              </div>
            }
            content={
              <>
                <div className="flex flex-row justify-between items-center mt-8 mb-4">
                  <div>
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </div>
                  
                </div>
              </>
            }
            onClick={() => router.push(`/explore/posts/${item.id}`)}
            footer={
              <div className='flex flex-col items-end'>
                <div className="flex flex-grow items-end h-auto space-x-4">
                  <div className="flex items-center space-x-2">
                  <ThumbUpIcon className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {item.likes} likes
                    </span>
                    <CommentsIcon className="w-5 h-5" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {item.comments.length} comments
                    </span>
                    <LeaderboardIcon className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.views} views</span>
                  </div>
                  <div className='flex flex-row content-end space-x-4'>
                    <ShareButton
                      itemId={item.id}
                      itemType="post"
                    />
                    <BookmarkButton
                      itemId={item.id}
                      itemType="post"
                      onClick={() => handleBookmark(item.id, 'post')}
                    />
                    <SubscribeButton
                      itemId={item.id}
                      itemType="post"
                      onClick={() => handleSubscribe(item.id, 'post')}
                    />
                  </div>
                </div>

                
              </div>
            }
          /*tags={(item as Post).tags}
          comments={(item as Post).comments}
          views={(item as Post).views}
          likes={(item as Post).likes}*/
          />
        );
      case 'project':
        return (
          <ProjectCard
            project={item as Project}
            onClick={() => router.push(`/projects/${item.id}`)}
          />
        );
      case 'file':
        return (
          <FileCard
            file={item as File}
            onClick={() => router.push(`/files/${item.id}`)}
          />
        );
      case 'space':
        return (
          <SpaceCard
            space={item as Space}
            onClick={() => router.push(`/spaces/${item.id}`)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="container mx-auto px-4 py-12 h-full"
    >
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Explore</h1>
        <div className="flex">
          {user?.role === "ADMIN" && (
            <Button variant="primary" className="w-36 mr-4" onClick={() => router.push('/explore/create')}>
              Create Post
            </Button>
          )}
        </div>
      </div>
      <Tabs
        tabs={[
          {
            id: 'featured',
            label: 'Featured',
            content: (
              <MasonryGrid
                items={featuredItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.type}`}
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.95 }}
                    className="mx-6 shadow-lg rounded-md dark:bg-gray-700 overflow-hidden transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-xl mb-8"
                  >
                    {renderItem(item)}
                  </motion.div>
                ))}
                columnWidth={300}
                gap={20}
              />
            ),
          },
          {
            id: 'trending',
            label: 'Trending',
            content: (
              <MasonryGrid
                items={trendingItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.type}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="shadow-lg rounded-md dark:bg-gray-700 overflow-hidden transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    {renderItem(item)}
                  </motion.div>
                ))}
                columnWidth={300}
                gap={20}
              />
            ),
          },
          {
            id: 'recommended',
            label: 'Recommended',
            content: (
              <MasonryGrid
                items={recommendedItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.type}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="shadow-lg rounded-md dark:bg-gray-700 overflow-hidden transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    {renderItem(item)}
                  </motion.div>
                ))}
                columnWidth={300}
                gap={20}
              />
            ),
          },
        ]}
      />
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center mt-8">
          <Skeleton count={3} />
        </div>
      )}
    </div>
  );
}

export default HomePage;