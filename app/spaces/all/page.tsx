// app/spaces/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SpaceCard from '@/components/SpaceCard';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import CreateSpaceModal from '@/components/CreateSpaceModal';
import EmptyState from '@/components/EmptyState';
import Spinner from '@/components/Spinner';
import Sidebar from '@/components/Sidebar';
import RecentlyViewedSpaces from '@/components/RecentlyViewedSpaces';
import PopularSpaces from '@/components/PopularSpaces';
import SpaceCategoryFilter from '@/components/SpaceCategoryFilter';
import SpaceSortDropdown from '@/components/SpaceSortDropdown';
import SpacePreviewModal from '@/components/SpacePreviewModal';
import { HomeIcon, CogIcon, FireIcon, TagIcon } from "@heroicons/react/24/solid";
import { Space, Project } from '@/lib/prisma';

const SpaceListPage: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('latest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch(
          `/api/spaces?page=${currentPage}&search=${searchTerm}&category=${selectedCategory}&sort=${sortOption}`
        );
        if (response.ok) {
          const data = await response.json();
          setSpaces(data.spaces);
          setTotalPages(data.totalPages);
        } else {
          console.error('Error fetching spaces:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
      setIsLoading(false);
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects);
        } else {
          console.error('Error fetching projects:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchSpaces();
    fetchProjects();
  }, [currentPage, searchTerm, selectedCategory, sortOption]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateSpace = async (title: string, description: string, projectId: number | null) => {
    try {
      const response = await fetch('/api/spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, projectId }),
      });
      if (response.ok) {
        const newSpace = await response.json();
        setSpaces((prevSpaces) => [...prevSpaces, newSpace]);
        setIsCreateModalOpen(false);
      } else {
        console.error('Error creating space:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating space:', error);
    }
  };

  const handleJoinSpace = async (spaceId: string) => {
    try {
      const response = await fetch(`/api/spaces/${spaceId}/join`, {
        method: 'POST',
      });
      if (response.ok) {
        setSpaces((prevSpaces) =>
          prevSpaces.map((space) =>
            space.id === spaceId ? { ...space, isJoined: true } : space
          )
        );
      } else {
        console.error('Error joining space:', response.statusText);
      }
    } catch (error) {
      console.error('Error joining space:', error);
    }
  };

  const handleLeaveSpace = async (spaceId: string) => {
    try {
      const response = await fetch(`/api/spaces/${spaceId}/leave`, {
        method: 'POST',
      });
      if (response.ok) {
        setSpaces((prevSpaces) =>
          prevSpaces.map((space) =>
            space.id === spaceId ? { ...space, isJoined: false } : space
          )
        );
      } else {
        console.error('Error leaving space:', response.statusText);
      }
    } catch (error) {
      console.error('Error leaving space:', error);
    }
  };

  const handleManageSpace = (spaceId: string) => {
    router.push(`/spaces/${spaceId}/settings`);
  };

  const handlePreviewSpace = (space: Space) => {
    setSelectedSpace(space);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <Sidebar items={[
          { id: 'home', label: 'Home', icon: <HomeIcon/>, link: '/spaces' },
          { id: 'spaces', label: 'Popular Spaces', icon: <FireIcon/>, link: '/spaces/popular' },
          { id: 'categories', label: 'Categories', icon: <TagIcon/>, link: '/spaces/categories' },
        ]} 
            onItemClick={(link) => router.push(link)}
            activeItem={''}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-4 mx-4 ">
          <h1 className="text-3xl font-semibold mb-4 md:mb-0">Spaces</h1>
          <div className="flex items-center">
            <SearchBar onSearch={handleSearch} className="mr-4" />
            {/*<SpaceCategoryFilter
              selectedCategory={selectedCategory}
              onCategoryFilter={handleCategoryFilter}
              className="mr-4"
    />*/}
            <SpaceSortDropdown
              sortOption={sortOption}
              onSortOptionChange={handleSortOptionChange}
            />
            <Button onClick={() => setIsCreateModalOpen(true)} className="ml-4">
              +
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-80">
            <Spinner />
          </div>
        ) : spaces.length === 0 ? (
          <EmptyState
            title="No spaces found"
            description="There are no spaces available at the moment."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onClick={() => handlePreviewSpace}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          </>
        )}
      </div>
      <CreateSpaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={() => handleCreateSpace}
        projects={projects}
      />
      <SpacePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        space={selectedSpace}
      />
    </div>
  );
};

export default SpaceListPage;