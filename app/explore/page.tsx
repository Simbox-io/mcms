'use client';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import PostCard from '@/components/PostCard';
import ProjectCard from '@/components/ProjectCard';
import FileCard from '@/components/FileCard';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import Carousel from '@/components/Carousel';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import {User} from '@/lib/prisma';
import {useSession} from "next-auth/react";
import { File, Post, Project } from '@/lib/prisma';

const HomePage: React.FC = () => {
    const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
    const [featuredFiles, setFeaturedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const {data: session} = useSession()
    const user = session?.user as User;
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [postsResponse, projectsResponse, filesResponse] = await Promise.all([
                    fetch('/api/posts'),
                    fetch('/api/projects'),
                    fetch('/api/files'),
                ]);

                if (postsResponse.ok && projectsResponse.ok && filesResponse.ok) {
                    const [postsData, projectsData, filesData] = await Promise.all([
                        postsResponse.json(),
                        projectsResponse.json(),
                        filesResponse.json(),
                    ]);

                    setFeaturedPosts(postsData.posts);
                    setFeaturedProjects(projectsData.projects);
                    setFeaturedFiles(filesData.files);
                } else {
                    console.error('Error fetching data');
                }

                setIsLoading(false); // Move this inside the try block
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Also set isLoading to false in case of an error
            }
        };

        fetchData();
    }, []);

    const handlePostClick = (postId: number) => {
        router.push(`/explore/posts/${postId}`);
    };

    const handleProjectClick = (projectId: number) => {
        router.push(`/projects/${projectId}`);
    };

    const handleFileClick = (fileId: number) => {
        router.push(`/files/${fileId}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-bold">Explore</h1>
                <div className="flex">
                    {user?.role === "ADMIN" && (
                        <Button variant="primary" className="w-36" onClick={() => router.push('/explore/create')}>
                            Create Post
                        </Button>
                    )}
                    <SearchBar className='hidden md:visible' onSearch={() => setIsSearching(true)}/>
                </div>
            </div>
                <>
                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Featured News</h2>
                            <Button variant="secondary" onClick={() => router.push('/explore/posts')}>
                                View All
                            </Button>
                        </div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" width="100%" height="200px"/>
                                ))}
                            </div>
                        ) : featuredPosts?.length > 0 ? (
                            <>
                                <div className="hidden md:block">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {featuredPosts?.map((post) => (
                                            <PostCard key={post.id} post={post}
                                                      onClick={() => handlePostClick(post.id)}/>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:hidden">
                                    <div className="md:hidden">
                                        <Carousel
                                            items={featuredPosts?.map((post) => (
                                                <PostCard key={post.id} post={post}
                                                          onClick={() => handlePostClick(post.id)}/>
                                            ))}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>No featured posts available.</p>
                        )}
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Featured Projects</h2>
                            <div className="flex items-center">
                                <CategoryFilter
                                    options={['Web', 'Mobile', 'Desktop', 'IoT']}
                                    onSelect={(category) => console.log('Selected category:', category)}
                                    className="mr-4"
                                />
                                <Button variant="secondary" onClick={() => router.push('/project/all-projects')}>
                                    View All
                                </Button>
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" width="100%" height="200px"/>
                                ))}
                            </div>
                        ) : featuredProjects?.length > 0 ? (
                            <>
                                <div className="hidden md:block">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {featuredProjects?.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                onClick={() => handleProjectClick(project.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="md:hidden">
                                    <Carousel
                                        items={featuredProjects?.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                onClick={() => handleProjectClick(project.id)}
                                            />
                                        ))}
                                    />
                                </div>
                            </>
                        ) : (
                            <p>No featured projects available.</p>
                        )}
                    </section>

                    <section className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold">Featured Files</h2>
                            <Button variant="secondary" onClick={() => router.push('/files/all-files')}>
                                View All
                            </Button>
                        </div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, index) => (
                                    <Skeleton key={index} variant="rectangular" width="100%" height="200px"/>
                                ))}
                            </div>
                        ) : featuredFiles.length > 0 ? (
                            <>
                                <div className="hidden md:block">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {featuredFiles?.map((file) => (
                                            <FileCard key={file.id} file={file} description={file.name}
                                                      onClick={() => handleFileClick(file.id)}/>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:hidden">
                                    <Carousel
                                        items={featuredFiles?.map((file) => (
                                            <FileCard key={file.id} file={file} description={file.name}
                                                      onClick={() => handleFileClick(file.id)}/>
                                        ))}
                                    />
                                </div>
                            </>
                        ) : (
                            <p>No featured files available.</p>
                        )}
                    </section>
                </>
        </div>
    );
};

export default HomePage;