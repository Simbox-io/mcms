// components/PostCard.tsx
'use client'
import React from 'react';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import { User, Tag } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { ChatBubbleLeftIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Post, Comment } from '@/lib/prisma';

interface PostCardProps {
    post: Post;
    onClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as User;

    const handleLike = async () => {
        try {
            await fetch(`/api/posts/${post.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.id }),
            });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = () => {
        router.push(`/explore/posts/${post.id}`);
    };

    const handleWatch = async () => {
        try {
            await fetch(`/api/posts/${post.id}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.id }),
            });
        } catch (error) {
            console.error('Error watching post:', error);
        }
    };

    return (
        <Card className="flex flex-col h-full justify-between">
            <div className="flex-1">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => router.push(`/profile/${post.author.id}`)}
                >
                    <Avatar src={post.author.avatar || ''} alt={post.author.username} size="medium" />
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {post.author.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {post.tags?.map((tag) => (
                        <Badge key={tag.id} variant="primary" size="small">
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="flex-col flex-grow mt-4" onClick={onClick}>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{post.title}</h2>
                <div
                    className="flex-grow text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
            <div className="flex flex-1 justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center" onClick={handleLike}>
                        <HeartIcon className="w-5 h-5 mr-1" />
                        <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center" onClick={handleComment}>
                        <ChatBubbleLeftIcon className="w-5 h-5 mr-1" />
                        <span>{post.comments?.length || '0' }</span>
                    </button>
                </div>
                <button className="flex items-center" onClick={handleWatch}>
                    <EyeIcon className="w-5 h-5 mr-1" />
                    <span>{post.views}</span>
                </button>
            </div>
        </Card>
    );
};

export default PostCard;