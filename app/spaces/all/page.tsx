'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Accordion from '@/components/next-gen/Accordion';
import Card from '@/components/next-gen/Card';
import Button from '@/components/next-gen/Button';
import Spinner from '@/components/next-gen/Spinner';
import Avatar from '@/components/next-gen/Avatar';
import { Activity, Space, Page } from '@/lib/prisma';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import CacheService from '../../../lib/cacheService';
import axios from 'axios';
import instance from '@/utils/api';

const AllSpacesPage: React.FC = () => {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [quickActions, setQuickActions] = useState<{ id: number; label: string }[]>([]);
  const [pinnedPages, setPinnedPages] = useState<Page[]>([]);
  const [recentlyVisited, setRecentlyVisited] = useState<Page[]>([]);
  const [popularSpaces, setPopularSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSpace, setActiveSpace] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityData, quickActionsData, pinnedPagesData, recentlyVisitedData, popularSpacesData] = await Promise.all([
          instance.get('/api/activities'),
          instance.get('/api/quick-actions'),
          instance.get('/api/pinned-pages'),
          instance.get('/api/recently-visited'),
          instance.get('/api/popular-spaces'),
        ]);

        setRecentActivity(activityData.data);
        setQuickActions(quickActionsData.data);
        setPinnedPages(pinnedPagesData.data);
        setRecentlyVisited(recentlyVisitedData.data);
        setPopularSpaces(popularSpacesData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickAction = (action: any) => {
    // Handle quick action functionality
    console.log('Quick action clicked:', action);
  };

  const handlePageClick = (page: Page) => {
    router.push(`/pages/${page.id}`);
  };

  const handleSpaceClick = (space: Space) => {
    setActiveSpace(space.id);
    router.push(`/spaces/${space.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className='flex'>
      <div className="container mx-auto px-4 py-4">
        <h2 className="text-2xl font-bold mt-8 mb-4"></h2>
        <div className="flex flex-row space-x-4 mb-8">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="primary"
              className="w-full"
              onClick={() => handleQuickAction(action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p>No recent activity found.</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <Card key={activity.id}>
                    <div className="flex items-center space-x-4">
                      <Avatar src={activity.user.avatar} alt={activity.user.username} />
                      <div>
                        <p className="font-bold">{activity.user.username}</p>
                        <p className="text-sm text-gray-500">{activity.message}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Pinned Pages</h2>
            {pinnedPages.length === 0 ? (
              <p>No pinned pages found.</p>
            ) : (
              <div className="space-y-4">
                {pinnedPages.map((page) => (
                  <Card key={page.id} onClick={() => handlePageClick(page)}>
                    <h3 className="text-xl font-bold">{page.title}</h3>
                    <p className="text-gray-500">{page.space.name}</p>
                  </Card>
                ))}
              </div>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4">Recently Visited</h2>
            {recentlyVisited.length === 0 ? (
              <p>No recently visited pages found.</p>
            ) : (
              <div className="space-y-4">
                {recentlyVisited.map((page) => (
                  <Card key={page.id} onClick={() => handlePageClick(page)}>
                    <h3 className="text-xl font-bold">{page.title}</h3>
                    <p className="text-gray-500">{page.space.name}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">What&apos;s Happening</h2>
          <Accordion
            items={[
              {
                title: 'Popular Spaces',
                content: (
                  <div className="space-y-4">
                    {popularSpaces.map((space) => (
                      <Card key={space.id} onClick={() => handleSpaceClick(space)}>
                        <h3 className="text-xl font-bold">{space.name}</h3>
                        <p className="text-gray-500">{space.description}</p>
                      </Card>
                    ))}
                  </div>
                ),
              },
              {
                title: 'Announcements',
                content: (
                  <div className="space-y-4">
                    {/* Add announcement content */}
                    <p>No announcements available.</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AllSpacesPage;
