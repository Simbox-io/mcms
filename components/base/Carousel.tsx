'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronLeftSVG from '../icons/ChevronLeft';
import ChevronRightSVG from '../icons/ChevronRight';

interface CarouselProps {
  items: React.ReactNode[];
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
  interval?: number;
  autoPlay?: boolean;
  indicators?: boolean;
  controls?: boolean;
  pauseOnHover?: boolean;
  className?: string;
  style?: React.CSSProperties;
  slideClassName?: string;
  indicatorClassName?: string;
  controlClassName?: string;
  prevLabel?: string;
  nextLabel?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  activeIndex = 0,
  onSlideChange,
  interval = 5000,
  autoPlay = false,
  indicators = true,
  controls = true,
  pauseOnHover = true,
  className = '',
  style,
  slideClassName = '',
  indicatorClassName = '',
  controlClassName = '',
  prevLabel = 'Previous',
  nextLabel = 'Next',
}) => {
  const [currentIndex, setCurrentIndex] = useState(activeIndex);
  const [isPaused, setIsPaused] = useState(!autoPlay);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      if (onSlideChange) {
        onSlideChange(index);
      }
    },
    [onSlideChange]
  );

  const goToPrevSlide = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNextSlide = useCallback(() => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, items.length, goToSlide]);

  useEffect(() => {
    if (autoPlay && !isPaused) {
      const timer = setInterval(goToNextSlide, interval);
      return () => {
        clearInterval(timer);
      };
    }
  }, [autoPlay, isPaused, interval, goToNextSlide]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex transition-transform duration-500 ease-out ${slideClassName}`}
          >
            {items[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
      {indicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 mx-1 rounded-full focus:outline-none ${
                currentIndex === index ? 'bg-white' : 'bg-gray-300'
              } ${indicatorClassName}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
      {controls && (
        <>
          <button
            className={`absolute top-1/2 left-4 transform -translate-y-1/2 focus:outline-none ${controlClassName}`}
            onClick={goToPrevSlide}
            aria-label={prevLabel}
          >
            <ChevronLeftSVG size={32} className="text-white" />
          </button>
          <button
            className={`absolute top-1/2 right-4 transform -translate-y-1/2 focus:outline-none ${controlClassName}`}
            onClick={goToNextSlide}
            aria-label={nextLabel}
          >
            <ChevronRightSVG size={32} className="text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;