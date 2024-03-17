'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PostCard from '@/components/PostCard';
import ProjectCard from '@/components/ProjectCard';
import FileCard from '@/components/FileCard';
import SpaceCard from '@/components/SpaceCard';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import CategoryFilter from '@/components/CategoryFilter';
import { User } from '@/lib/prisma';
import { useSession } from "next-auth/react";
import { File, Post, Project, Space } from '@/lib/prisma';
import TagInput from '@/components/TagInput';
import { motion } from 'framer-motion';
import FeaturedSection from '@/components/FeaturedSection';
import ShareButton from '@/components/ShareButton';
import BookmarkButton from '@/components/BookmarkButton';
import SubscribeButton from '@/components/SubscribeButton';
import BadgeIcon from '@/components/icons/BadgeIcon';
import LeaderboardIcon from '@/components/icons/LeaderboardIcon';
import MasonryGrid from '@/components/MasonryGrid';
import Tabs from '@/components/Tabs';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('featured');
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
  
        switch (activeTab) {
          case 'featured':
            setFeaturedItems(allFeaturedItems);
            break;
          case 'trending':
            // Fetch trending items based on the API routes
            break;
          case 'recommended':
            // Fetch recommended items based on the API routes
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${activeTab} items:`, error);
      }
    };
  
    fetchItems();
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage(1);
    setHasMore(true);
    switch (tabId) {
      case 'featured':
        setFeaturedItems([]);
        break;
      case 'trending':
        setTrendingItems([]);
        break;
      case 'recommended':
        setRecommendedItems([]);
        break;
      default:
        break;
    }
  };

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
          <PostCard
            post={item as Post}
            onClick={() => router.push(`/posts/${item.id}`)}
            author={(item as Post).author}
            tags={(item as Post).tags}
            comments={(item as Post).comments}
            views={(item as Post).views}
            likes={(item as Post).likes}
          />
        );
      case 'project':
        return (
          <ProjectCard
            project={item as Project}
            onClick={() => router.push(`/projects/${item.id}`)}
            owner={(item as Project).owner}
            members={(item as Project).collaborators}
            spaces={(item as Project).spaces}
          />
        );
      case 'file':
        return (
          <FileCard
            file={item as File}
            onClick={() => router.push(`/files/${item.id}`)}
            uploadedBy={(item as File).uploadedBy}
            project={(item as File).project || undefined}
            tags={(item as File).tags}
          />
        );
      case 'space':
        return (
          <SpaceCard
            space={item as Space}
            onClick={() => router.push(`/spaces/${item.id}`)}
            author={(item as Space).owner}
            project={(item as Space).project || undefined}
            pages={(item as Space).pages}
            views={(item as Space).views}
          />
        );
      default:
        return null;
    }
  };

  const renderItems = () => {
    const items = activeTab === 'featured' ? featuredItems : activeTab === 'trending' ? trendingItems : recommendedItems;
    return (
      <MasonryGrid
        items={items.map((item) => (
          <motion.div
            key={`${item.id}-${item.type}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="shadow-lg rounded-md dark:bg-gray-700 overflow-hidden transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
          >
            {renderItem(item)}
            <div className="flex justify-end items-center px-4 py-2 space-x-12">
              <ShareButton itemId={item.id} itemType={item.type} />
              <BookmarkButton itemId={item.id} itemType={item.type} onBookmark={handleBookmark} />
              <SubscribeButton itemId={item.id} itemType={item.type} onSubscribe={handleSubscribe} />
            </div>
          </motion.div>
        ))}
        columnWidth={300}
        gap={20}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
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
          { id: 'featured', label: 'Featured' },
          { id: 'trending', label: 'Trending' },
          { id: 'recommended', label: 'Recommended' },
        ]}
        activeTab={activeTab}
        onChange={handleTabChange}
        className="mb-8"
      />
      {renderItems()}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center mt-8">
          <Skeleton count={3} />
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-center items-center mt-8">
        <div className="flex items-center mr-4 mb-4 md:mb-0">
          <BadgeIcon className="w-6 h-6 text-yellow-500 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">Earn badges for your contributions!</span>
        </div>
        <div className="flex items-center">
          <LeaderboardIcon className="w-6 h-6 text-green-500 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">Climb the leaderboard and showcase your achievements!</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;