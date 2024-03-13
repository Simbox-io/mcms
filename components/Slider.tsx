// components/Slider.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  valueClassName?: string;
  showValue?: boolean;
  valuePosition?: 'top' | 'bottom';
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = '',
  trackClassName = '',
  thumbClassName = '',
  valueClassName = '',
  showValue = false,
  valuePosition = 'top',
}) => {
  const [dragging, setDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      setDragging(false);
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - left;
      const percentage = clickPosition / width;
      const newValue = min + (max - min) * percentage;
      onChange(Math.round(newValue / step) * step);
    }
  };

  const getProgressStyle = () => {
    const progress = ((value - min) / (max - min)) * 100;
    return { width: `${progress}%` };
  };

  const getThumbStyle = () => {
    const progress = ((value - min) / (max - min)) * 100;
    return { left: `${progress}%` };
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={sliderRef}
        className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer ${trackClassName}`}
        onClick={handleSliderClick}
      >
        <div
          className={`absolute top-0 left-0 h-2 bg-blue-500 rounded-full ${trackClassName}`}
          style={getProgressStyle()}
        ></div>
        <div
          ref={thumbRef}
          className={`absolute top-0 w-4 h-4 -mt-1 -ml-2 bg-white dark:bg-gray-800 rounded-full shadow cursor-pointer transform -translate-x-1/2 ${thumbClassName} ${
            dragging ? 'scale-110' : ''
          }`}
          style={getThumbStyle()}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        ></div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="sr-only"
      />
      {showValue && (
        <div
          className={`absolute ${
            valuePosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded-md py-1 px-2 text-sm ${valueClassName}`}
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default Slider;