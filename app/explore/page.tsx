import ItemCard from "@/components/explore/item-card";
import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { File, Post, Project, Space, Bookmark } from '@/lib/prisma';
import { getProjects, getFiles, getSpaces, getPosts } from "@/lib/utils";

const Explore: React.FC = async () => {
    const user = await currentUser();

    let featuredItems: (Post | Project | File | Space)[] = [];

    try {
        const [postsData, projectsData, filesData, spacesData] = await Promise.all([
            await getPosts() as unknown as Post[],
            await getProjects() as unknown as Project[],
            await getFiles() as unknown as File[],
            await getSpaces() as unknown as Space[]
        ]);

        const featuredPosts = postsData?.map((post: Post) => ({ ...post, type: 'post' }));
        const featuredProjects = projectsData?.map((project: Project) => ({ ...project, type: 'project' }));
        const featuredFiles = filesData?.map((file: File) => ({ ...file, type: 'file' }));
        const featuredSpaces = spacesData?.map((space: Space) => ({ ...space, type: 'space' as const }));

        featuredItems = [...featuredPosts, ...featuredProjects, ...featuredFiles, ...featuredSpaces] as (Post | Project | File | Space)[];
    } catch (error) {
        console.error('Error fetching featured items:', error);
    }
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
        switch (item?.type) {
            case 'post':
                return (
                    <ItemCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        type={item.type}
                        description={item.content || ''}
                        creationDate={new Date(item.createdAt).toLocaleDateString() || ''}
                        author={item.author}
                        initialIsBookmarked={item.bookmarks?.some((bookmark: Bookmark) => bookmark.userId === user?.id)}
                    />
                );
            case 'project':
                return (
                    <ItemCard
                        key={item.id}
                        id={item.id}
                        title={item.name}
                        type={item.type}
                        description={item.description || ''}
                        creationDate={new Date(item.createdAt).toLocaleDateString() || ''}
                        author={item.owner}
                        initialIsBookmarked={item.bookmarks?.some((bookmark: Bookmark) => bookmark.userId === user?.id)}
                    />
                );
            case 'file':
                return (
                    <ItemCard
                        id={item.id}
                        key={item.id}
                        title={item.name}
                        type={item.type}
                        description={item.description || ''}
                        creationDate={new Date(item.createdAt).toLocaleDateString() || ''}
                        author={item.uploadedBy}
                        initialIsBookmarked={item.bookmarks?.some((bookmark: Bookmark) => bookmark.userId === user?.id)}
                    />
                );
            case 'space':
                return (
                    <ItemCard
                        id={item.id}
                        key={item.id}
                        title={item.name}
                        type={item.type}
                        description={item.description || ''}
                        creationDate={new Date(item.createdAt).toLocaleDateString() || ''}
                        author={item.owner}
                        initialIsBookmarked={item.bookmarks?.some((bookmark: Bookmark) => bookmark.userId === user?.id)}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div className="container px-12 lg:px-auto px-8 py-12 h-full">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200">Explore</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredItems.map((item) => (
                    renderItem(item)
                ))}
            </div>
        </div>
    )
}

export default Explore;

