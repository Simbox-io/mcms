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

    const handleJoinSpace = async (spaceId: number) => {
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

    const handleLeaveSpace = async (spaceId: number) => {
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

    const handleManageSpace = (spaceId: number) => {
        router.push(`/spaces/${spaceId}/settings`);
    };

    const handlePreviewSpace = (space: Space) => {
        setSelectedSpace(space);
        setIsPreviewModalOpen(true);
    };

    const sidebarItems = [
        { id: 'recent', label: 'Recently Viewed', icon: <HomeIcon className="w-5 h-5" />, link: '/spaces/recently-viewed' },
        { id: 'popular', label: 'Popular Spaces', icon: <FireIcon className="w-5 h-5" />, link: '/spaces/popular' },
        { id: 'categories', label: 'Categories', icon: <TagIcon className="w-5 h-5" />, link: '/spaces/categories' },
        { id: 'settings', label: 'Settings', icon: <CogIcon className="w-5 h-5" />, link: '/spaces/settings' },
    ];

    return (
        <div className="flex h-full">
            <div className="lg:block w-64 bg-white dark:bg-gray-700 border-r border-gray-200 dark:border-gray-700">
                <Sidebar
                    activeItem="recent"
                    items={sidebarItems}
                    onItemClick={() => handlePageChange}
                />
            </div>
            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold">Spaces</h1>
                    <Button onClick={() => setIsCreateModalOpen(true)}>Create Space</Button>
                </div>
                <div className="flex justify-between items-center mb-8">
                    <SearchBar onSearch={handleSearch} className="w-1/2" />
                    <div className="flex items-center">
                        <SpaceCategoryFilter
                            selectedCategory={selectedCategory}
                            onCategoryFilter={handleCategoryFilter}
                            className="mr-4"
                        />
                        <SpaceSortDropdown
                            sortOption={sortOption}
                            onSortOptionChange={handleSortOptionChange}
                        />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {spaces.map((space) => (
                                <SpaceCard
                                    key={space.id}
                                    space={space}
                                    onJoin={() => handleJoinSpace(space.id)}
                                    onLeave={() => handleLeaveSpace(space.id)}
                                    onManage={() => handleManageSpace(space.id)}
                                    onPreview={() => handlePreviewSpace(space)}
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
                <CreateSpaceModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateSpace}
                    projects={projects}
                />
                <SpacePreviewModal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                    space={selectedSpace}
                />
            </div>
        </div>
    );
};

export default SpaceListPage;