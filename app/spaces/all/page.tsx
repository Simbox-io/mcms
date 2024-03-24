// app/spaces/all/page.tsx
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Accordion from '../../../components/next-gen/Accordion';
import Card from '../../../components/next-gen/Card';
import Button from '../../../components/next-gen/Button';
import Spinner from '../../../components/next-gen/Spinner';
import Avatar from '../../../components/next-gen/Avatar';
import { Space } from '../../../lib/prisma';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import CacheService from '../../../lib/cacheService';
import axios from 'axios';
import instance from '@/utils/api';

interface PinnedSpaceData {
  id: number;
  name: string;
  description: string;
}

interface PopularSpacesData {
  id: number;
  name: string;
  description: string;
}

const AllSpacesPage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSpace, setActiveSpace] = useState(null);
  const [pinnedSpaces, setPinnedSpaces] = useState<PinnedSpaceData[]>([]);
  const [popularSpaces, setPopularSpaces] = useState<PopularSpacesData[]>([]);
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

        // Fetch popular spaces data
        const popularSpacesData = await Promise.resolve([
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
        setPopularSpaces(popularSpacesData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="flex">
      <div className="container mx-auto px-4 py-4">
        <h2 className="text-2xl font-bold mb-4">Pinned Spaces</h2>
        {pinnedSpaces.length === 0 ? (
          <p>No pinned spaces found.</p>
        ) : (
          <div className="space-y-4">
            {pinnedSpaces.map((space) =><Card key={space.id} onClick={() => handleSpaceClick(space)} className="flex justify-center items-center h-screen">
  <h3 className="text-xl font-bold">{space.name.replace("'", "&apos;")}</h3>
  <p className="text-gray-500">{space.description.replace("'", "&apos;")}</p>
</Card>
            ))}
          </div>
        )}

        <div className="mt-12">
          
          <h2 className="text-2xl font-bold mb-4">What's Happening</h2>
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
