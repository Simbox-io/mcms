// components/Rating.tsx
'use client'
import React, { useState } from 'react';

interface RatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({ value, onChange, max = 5, className = '' }) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleClick = (rating: number) => {
    onChange(rating);
  };

  const handleMouseEnter = (rating: number) => {
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= max; i++) {
      const isActive = i <= (hoverRating || value);

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          className={`text-2xl ${
            isActive ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-600'
          }`}
        >
          &#9733;
        </button>
      );
    }

    return stars;
  };

  return <div className={`inline-flex ${className}`}>{renderStars()}</div>;
};

export default Rating;