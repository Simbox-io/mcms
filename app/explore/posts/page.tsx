// app/explore/news/page.tsx
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post, User } from '@/lib/prisma';
import Avatar from '@/components/Avatar';
import Skeleton from '@/components/Skeleton';
import TagInput from '@/components/TagInput';
import CommentsIcon from '@/components/icons/CommentsIcon';
import ThumbUpIcon from '@/components/icons/ThumbUpIcon';
import EyeIcon from '@/components/icons/EyeIcon';
import CategoryFilter from "@/components/CategoryFilter";
import { useRouter } from 'next/navigation';
import instance from '@/utils/api';

const NewsFeed: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const router = useRouter();

    const fetchPosts = useCallback(async () => {
        const nextPage = page + 1;
        try {
            const response = await instance.get(`/api/posts?page=${nextPage}&tags=${selectedTags.join(',')}&categories=${categories.join(',')}`);
            if(page===0) { setPosts(response.data.posts) } else {
                setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
            }
            setHasMore(response.data.length > 0);
            setIsLoading(false);
            setPage(nextPage);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [page, selectedTags, categories]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        if (isLoading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1 }
        );

        if (posts.length > 0) {
            observer.observe(document.querySelector('#sentinel')!);
        }

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isLoading, hasMore, posts]);

    const handlePostClick = (post: Post) => {
        router.push(`/explore/posts/${post.id}`);
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-8 flex justify-between space-x-4">
                <TagInput
                    tags={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Filter by tags..."
                    className="w-full"
                />
                <CategoryFilter 
                    categories={['All', 'Technology', 'Programming', 'Design', 'DevOps', 'Cloud', 'AI']}
                    selectedCategory={categories.length > 0 ? categories[0] : 'All'}
                    onChange={(category) => {
                        setPage(0);
                        if (category === 'All') {
                            setCategories([]);
                        } else {
                            setCategories([category]);
                        }
                    }}
                    className="w-64"
                />
            </div>

            <AnimatePresence>
                {posts?.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
                        onClick={() => handlePostClick(post)}
                    >
                        <div className="flex items-center mb-4" onClick={() => handlePostClick}>
                            <Avatar src={post.author.avatar || ''} alt={post.author.username} size="medium" />
                            <div className="ml-4">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{post.author.username}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">{post.title}</h2>
                        <div className="text-gray-600 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: post.content.slice(0,300) + (post.content.length > 300 ? '...' : '') }} />
                        <div className="flex justify-end space-x-3">
                            <div className="flex items-center">
                                <CommentsIcon />
                                <span className="text-gray-600 dark:text-gray-300">{post.comments?.length || '0'}</span>
                            </div>
                            <div className="flex items-center">
                                <ThumbUpIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-3" />
                                <span className="text-gray-600 dark:text-gray-300">{post.likes || '0'}</span>
                            </div>
                            <div className="flex items-center">
                                <EyeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 mr-3" />
                                <span className="text-gray-600 dark:text-gray-300">{post.views || '0'}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {isLoading && (
                <div className="mb-8">
                    <Skeleton variant="rectangular" width="100%" height="200px" className="mb-4" />
                    <Skeleton variant="text" width="60%" height="30px" className="mb-2" />
                    <Skeleton variant="text" width="40%" height="20px" />
                </div>
            )}

            {!isLoading && posts.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">No posts found.</p>
            )}

            <div id="sentinel" className="h-4"></div>

            {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">Looks like that&apos;s it for now!</p>
            )}
        </div>
    );
};

export default NewsFeed;