import React from 'react';

interface MetaDataProps {
  tags?: string[];
  metrics?: {
    likes?: number;
    comments?: number;
    views?: number;
  };
  className?: string;
  style?: React.CSSProperties;
}

const MetaData: React.FC<MetaDataProps> = ({ tags, metrics, className = '', style }) => {
  return (
    <div className={`flex items-center ${className}`} style={style}>
      {tags && (
        <div className="flex items-center">
          <TagIcon className="w-4 h-4 text-gray-400 mr-1" />
          <p className="text-sm text-gray-500 dark:text-gray-400">{tags.join(', ')}</p>
        </div>
      )}
      {metrics && (
        <div className="flex items-center ml-4">
          {metrics.likes !== undefined && (
            <div className="flex items-center mr-2">
              <LikeIcon className="w-4 h-4 text-gray-400 mr-1" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{metrics.likes}</p>
            </div>
          )}
          {metrics.comments !== undefined && (
            <div className="flex items-center mr-2">
              <CommentIcon className="w-4 h-4 text-gray-400 mr-1" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{metrics.comments}</p>
            </div>
          )}
          {metrics.views !== undefined && (
            <div className="flex items-center">
              <ViewIcon className="w-4 h-4 text-gray-400 mr-1" />
              <p className="text-sm text-gray-500 dark:text-gray-400">{metrics.views}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const LikeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
);

const CommentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
      clipRule="evenodd"
    />
  </svg>
);

const ViewIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path
      fillRule="evenodd"
      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default MetaData;