import ItemCard from "@/components/explore/item-card";
import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { File, Post, Project, Space, Bookmark } from '@/lib/prisma';
import { getProjects, getFiles, getSpaces, getPosts } from "@/app/actions/actions";

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
        <div className="container px-8 lg:px-auto py-10 h-full">
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

