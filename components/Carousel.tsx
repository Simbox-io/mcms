// components/Carousel.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';

interface CarouselProps {
  items: React.ReactNode[];
  autoplay?: boolean;
  interval?: number;
  controls?: boolean;
  indicators?: boolean;
  pauseOnHover?: boolean;
  onSlideChange?: (currentSlide: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoplay = false,
  interval = 5000,
  controls = true,
  indicators = true,
  pauseOnHover = true,
  onSlideChange,
  className = '',
  style,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startAutoplay = () => {
      timer = setInterval(() => {
        goToNextSlide();
      }, interval);
    };

    const stopAutoplay = () => {
      clearInterval(timer);
    };

    if (isPlaying) {
      startAutoplay();
    }

    return () => {
      stopAutoplay();
    };
  }, [isPlaying, interval]);

  const goToPrevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
  };

  const goToNextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(activeIndex);
    }
  }, [activeIndex, onSlideChange]);

  return (
    <div
      ref={carouselRef}
      className={`carousel relative ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="carousel-inner relative w-full overflow-hidden">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${
              index === activeIndex ? 'active' : ''
            } absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out`}
          >
            {item}
          </div>
        ))}
      </div>
      {controls && (
        <>
          <button
            className="carousel-control-prev absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-md focus:outline-none"
            onClick={goToPrevSlide}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            className="carousel-control-next absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l-md focus:outline-none"
            onClick={goToNextSlide}
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}
      {indicators && (
        <div className="carousel-indicators absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator w-3 h-3 rounded-full bg-white bg-opacity-50 focus:outline-none ${
                index === activeIndex ? 'bg-opacity-100' : ''
              }`}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default Carousel;