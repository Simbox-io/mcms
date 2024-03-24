// app/spaces/all/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Card from '../../../components/next-gen/Card';
import Button from '../../../components/next-gen/Button';
import Spinner from '../../../components/next-gen/Spinner';
import { formatDate } from '../../../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiList } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import Input from '../../../components/next-gen/Input';
import CategoryFilter from '@/components/CategoryFilter';
import CacheService from '../../../lib/cacheService';
import axios from 'axios';

interface Space {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: number;
    username: string;
  };
  members: {
    id: number;
    username: string;
  }[];
}

interface PinnedSpace {
  id: number;
  name: string;
  description: string;
}

const AllSpacesPage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterQuery, setFilterQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pinnedSpaces, setPinnedSpaces] = useState<PinnedSpace[]>([]);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheKey = `/api/spaces`;
        const cachedData = await CacheService.get<{ spaces: Space[] }>(cacheKey);

        if (cachedData) {
          setSpaces(cachedData.spaces);
        } else {
          const response = await axios.get(`/api/spaces`);
          if (response.status === 200) {
            const data = response.data;
            setSpaces(data.spaces);
            await CacheService.set(cacheKey, data);
          } else {
            console.error('Error fetching spaces:', response.statusText);
          }
        }

        // Fetch pinned spaces data
        const pinnedSpacesData = await Promise.resolve([
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
        ]);
        setPinnedSpaces(pinnedSpacesData);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterSpaces = (spaces: Space[], filterQuery: string) => {
    return spaces.filter(
      (space: Space) =>
        space.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
        space.description.toLowerCase().includes(filterQuery.toLowerCase())
    );
  };

  const filteredSpaces = React.useMemo(() => {
    return filterSpaces(spaces, filterQuery);
  }, [spaces, filterQuery]);

  const handleCreateSpace = () => {
    router.push('/spaces/create');
  };

  const handleSelectSpace = (space: Space) => {
    router.push(`/spaces/${space.id}`);
  };

  const handleChangeCategory = (category: string) => {
    console.log(category);
  };

  const toggleView = () => {
    setView(view === 'grid' ? 'list' : 'grid');
  };

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">All Spaces</h2>
        <div className="flex items-center space-x-4">
          <Button variant="primary" onClick={handleCreateSpace}>
            <IoMdAdd />
          </Button>
          <Button variant="secondary" onClick={toggleView}>
            {view === 'grid' ? <FiList /> : <FiGrid />}
          </Button>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex justify-between">
          <div className="flex-grow mr-4">
            <Input
              type="text"
              placeholder="Filter spaces..."
              value={filterQuery}
              onChange={setFilterQuery}
              className=""
            />
          </div>
          <CategoryFilter onSelect={handleChangeCategory} options={[{ label: 'test' }, { label: 'test2' }]} className='' />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Pinned Spaces</h2>
      {pinnedSpaces.length === 0 ? (
        <p>No pinned spaces found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {pinnedSpaces.map((space) => (
            <motion.div
              key={space.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectSpace(space as Space)}
            >
              <Card className="h-72">
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {space.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {space.description.slice(0, 100)}...
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center mt-8">
          <Spinner size="large" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredSpaces.map((space) => (
                <motion.div
                  key={space.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectSpace(space)}
                >
                  <Card className="h-72">
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {space.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {space.description.slice(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-gray-600 dark:text-gray-400">
                          Created by {space.owner.username}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {formatDate(space.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {filteredSpaces.map((space) => (
                <motion.div
                  key={space.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectSpace(space)}
                >
                  <Card>
                    <div className="flex items-center p-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                          {space.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {space.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          <p className="text-gray-600 dark:text-gray-400">
                            Created by {space.owner.username}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {formatDate(space.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {!isLoading && filteredSpaces.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">No spaces found.</p>
      )}
    </motion.div>
  );
};

export default AllSpacesPage;
