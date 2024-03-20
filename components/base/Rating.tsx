'use client';
import React, { useState } from 'react';

interface RatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  className?: string;
  starClassName?: string;
  activeStarClassName?: string;
  inactiveStarClassName?: string;
  halfStarEnabled?: boolean;
  readOnly?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  className = '',
  starClassName = '',
  activeStarClassName = '',
  inactiveStarClassName = '',
  halfStarEnabled = false,
  readOnly = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!readOnly) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(null);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= max; i++) {
      const isActive = i <= (hoverRating || value);
      const isHalfStar = halfStarEnabled && i === Math.ceil(value) && value % 1 !== 0;

      stars.push(
        <span
          key={i}
          className={`inline-block cursor-pointer ${starClassName} ${
            isActive ? activeStarClassName : inactiveStarClassName
          }`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          {isHalfStar ? (
            <HalfStarIcon className={activeStarClassName} />
          ) : isActive ? (
            <FullStarIcon className={activeStarClassName} />
          ) : (
            <EmptyStarIcon className={inactiveStarClassName} />
          )}
        </span>
      );
    }
    return stars;
  };

  return <div className={`inline-flex ${className}`}>{renderStars()}</div>;
};

const FullStarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${className}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HalfStarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${className}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292zM10 12.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM10 9a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 9z" />
  </svg>
);

const EmptyStarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

export default Rating;