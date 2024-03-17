import { useState } from 'react';
import { Comment } from '@/lib/prisma';
import { useSession } from 'next-auth/react';
import { User } from '@/lib/prisma';

interface CommentProps {
  comment: Comment;
}

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [isDownvoted, setIsDownvoted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as User | undefined;

  const toggleUpvote = () => {
    setIsUpvoted(!isUpvoted);
    setIsDownvoted(false);
  };

  const toggleDownvote = () => {
    setIsDownvoted(!isDownvoted);
    setIsUpvoted(false);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const toggleReport = () => {
    setIsReported(!isReported);
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-4 flex flex-col">
      <div className="flex">
        <div className="flex flex-col space-y-3">
          <button
            className={`mr-4 mt-4 focus:outline-none ${isDownvoted ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            onClick={toggleDownvote}
          >
            <div className='flex flex-row space-x-1'>
              <DownvoteIcon />
              <span className="ml-1">{comment.downvotes}</span>
            </div>
          </button>
          <button
            className={`mr-4 focus:outline-none ${isUpvoted ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            onClick={toggleUpvote}
          >
            <div className='flex flex-row space-x-1'>
              <UpvoteIcon />
              <span className="ml-1">{comment.upvotes}</span>
            </div>
          </button>
        </div>
        <div className="flex flex-col space-y-2">
          <div>
            <span className="font-bold text-gray-800 dark:text-gray-200">{comment.author.username}</span>
            <span className="ml-2 text-sm text-gray-500">{comment.createdAt.toString()}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{comment.content}</p>
        </div>
        {comment.children && comment.children.length > 0 && (
          <div className="ml-8 mt-4">
            {comment.children.map((childComment) => (
              <CommentComponent key={childComment.id} comment={childComment} />
            ))}
          </div>
        )}
      </div>
      <div className="flex mt-4 ml-12">
        <button
          className={`mr-4 focus:outline-none ${isSaved ? 'text-yellow-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          onClick={toggleSave}
        >
          <SaveIcon />
        </button>
        <button
          className={`focus:outline-none ${isReported ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          onClick={toggleReport}
        >
          <ReportIcon />
        </button>
        {comment.authorId === user?.id && (
          <button className="ml-4 focus:outline-none text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )
        }
      </div>

    </div>
  );
};

const UpvoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
      clipRule="evenodd"
    />
  </svg>
);

const DownvoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 2a8 8 0 100 16 8 8 0 000-16zm-1 11a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13z"
      clipRule="evenodd"
    />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
      clipRule="evenodd"
    />
  </svg>
);

export default CommentComponent;