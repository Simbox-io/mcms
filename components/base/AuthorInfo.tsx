import React from 'react';
import Avatar from './Avatar';
import { format } from 'date-fns';

interface AuthorInfoProps {
  author: {
    name: string;
    avatar: string;
  };
  date?: string;
  className?: string;
  style?: React.CSSProperties;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ author, date, className = '', style }) => {
  return (
    <div className={`flex items-center ${className}`} style={style}>
      <Avatar src={author.avatar} alt={author.name} size="small" />
      <div className="ml-2">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{author.name}</p>
        {date && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(date), 'MMMM d, yyyy')}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;