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

interface ActivityData {
  id: number;
  user: {
    username: string;
    avatar: string;
  };
  message: string;
}

interface QuickActionData {
  id: number;
  label: string;
}

interface PinnedPageData {
  id: number;
  title: string;
  space: {
    id: number;
    name: string;
  };
}

interface RecentlyVisitedData {
  id: number;
  title: string;
  space: {
    id: number;
    name: string;
  };
}

interface PopularSpacesData {
  id: number;
  name: string;
  description: string;
}


const MainPage = () => {
  const [recentActivity, setRecentActivity] = useState<ActivityData[]>([]);
  const [quickActions, setQuickActions] = useState<QuickActionData[]>([]);
  const [pinnedPages, setPinnedPages] = useState<PinnedPageData[]>([]);
  const [recentlyVisited, setRecentlyVisited] = useState<RecentlyVisitedData[]>([]);
  const [popularSpaces, setPopularSpaces] = useState<PopularSpacesData[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSpace, setActiveSpace] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityData, quickActionsData, pinnedPagesData, recentlyVisitedData, popularSpacesData] = await Promise.all([
          // Fetch recent activity data
          // for now, let's use sample data
          Promise.resolve([
            {
              id: 1,
              user: {
                username: 'John Doe',
                avatar: 'https://randomuser.me/api/portrait.jpg',
              },
              message: 'created a new page',
            },
            {
              id: 2,
              user: {
                username: 'Jane Doe',
                avatar: 'https://randomuser.me/api/portrait.jpg',
              },
              message: 'updated the homepage',
            },
          ]),
          // Fetch quick actions data
          // for now, let's use sample data
          Promise.resolve([
            {
              id: 1,
              label: 'Create Page',
            },
            {
              id: 2,
              label: 'Create Space',
            },
          ]),
          // Fetch pinned pages data
          // for now, let's use sample data
          Promise.resolve([
            {
              id: 1,
              title: 'Getting Started',
              space: {
                id: 1,
                name: 'Documentation',
              },
            },
            {
              id: 2,
              title: 'Homepage',
              space: {
                id: 2,
                name: 'Company',
              },
            },
          ]),
          // Fetch recently visited data
          // for now, let's use sample data
          Promise.resolve([
            {
              id: 1,
              title: 'Getting Started',
              space: {
                id: 1,
                name: 'Documentation',
              },
            },
            {
              id: 2,
              title: 'Homepage',
              space: {
                id: 2,
                name: 'Company',
              },
            },
          ]),
          // Fetch popular spaces data
          // for now, let's use sample data
          Promise.resolve([
            {
              id: 1,
              name: 'Documentation',
              description: 'Learn how to use our product',
            },
            {
              id: 2,
              name: 'Company',
              description: 'Company-wide information',
            },
          ]),
        ]);

        setRecentActivity(activityData);
        setQuickActions(quickActionsData);
        setPinnedPages(pinnedPagesData);
        setRecentlyVisited(recentlyVisitedData);
        setPopularSpaces(popularSpacesData);
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

  const handlePageClick = (page: any) => {
    router.push(`/pages/${page.id}`);
  };

  const handleSpaceClick = (space: any) => {
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

export default MainPage;