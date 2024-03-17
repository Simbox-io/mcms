import React from 'react';
import { Post, User, Tag, Comment } from '@/lib/prisma';
import Card from '@/components/Card';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  author: User;
  tags: Tag[];
  comments: Comment[];
  views: number;
  likes: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, onClick, author, tags, comments, views, likes }) => {
  return (
    <Card onClick={onClick}>
      <div className="flex items-center">
        <Avatar src={author.avatar || ''} alt={author.username} size="small" />
        <div className="ml-2">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">{author.username}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{post.title}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: post.content}}/>
      </div>
      <div className="mt-4 flex flex-wrap">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="primary" className="mr-2 mb-2">
            {tag.name}
          </Badge>
        ))}
      </div>
      <div className="mt-4 flex justify-end space-x-12 items-center">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{views}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{likes}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{comments.length}</span>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;