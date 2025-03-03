'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FiMessageCircle, FiPlusCircle, FiEye, FiClock } from 'react-icons/fi';
import Spinner from '@/components/base/Spinner';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import formatDistance from 'date-fns/formatDistance';

interface ForumCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  order: number;
  icon: string | null;
  _count: {
    topics: number;
  };
}

export default function ForumPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentTopics, setRecentTopics] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, topicsResponse] = await Promise.all([
          axios.get('/api/forum/categories'),
          axios.get('/api/forum/topics?perPage=5&sort=updatedAt&order=desc')
        ]);
        setCategories(categoriesResponse.data.categories);
        setRecentTopics(topicsResponse.data.topics);
      } catch (error) {
        console.error('Error fetching forum data:', error);
        toast({
          title: 'Error',
          description: 'Could not load forum data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        {session && (
          <button
            onClick={() => router.push('/forum/new-topic')}
            className="btn btn-primary flex items-center space-x-2"
          >
            <FiPlusCircle className="w-5 h-5" />
            <span>New Topic</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Categories</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {categories.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No categories found.
                </div>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <Link href={`/forum/categories/${category.slug}`}>
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {category.icon ? (
                            <span className="text-2xl">{category.icon}</span>
                          ) : (
                            <FiMessageCircle className="w-6 h-6 text-primary-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 text-center">
                          <span className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                            {category._count.topics}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Topics
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTopics.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No recent topics found.
                </div>
              ) : (
                recentTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <Link href={`/forum/topics/${topic.slug}`}>
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {topic.title}
                          </h3>
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            {topic.category.name}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2 space-x-4">
                          <div className="flex items-center">
                            <FiEye className="w-4 h-4 mr-1" />
                            <span>{topic.viewCount} views</span>
                          </div>
                          <div className="flex items-center">
                            <FiMessageCircle className="w-4 h-4 mr-1" />
                            <span>{topic._count.posts} replies</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-1" />
                            <span>{formatDistance(new Date(topic.updatedAt), new Date(), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          By {topic.author.username}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
              <Link href="/forum/topics" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium">
                View all topics →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
