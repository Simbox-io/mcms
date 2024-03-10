// components/Slider.tsx
'use client'
import React, { useState } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  className = '',
}) => {
  const [dragging, setDragging] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  const handleMouseDown = () => {
    setDragging(true);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const getProgressStyle = () => {
    const progress = ((value - min) / (max - min)) * 100;
    return { width: `${progress}%` };
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
      <div
        className="absolute top-0 left-0 h-2 bg-blue-500 rounded-lg"
        style={getProgressStyle()}
      ></div>
      <div
        className={`absolute top-0 h-4 w-4 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 transform -translate-x-1/2 -translate-y-1/2 transition-transform ${
          dragging ? 'scale-110' : ''
        }`}
        style={{ left: `${getProgressStyle().width}` }}
      ></div>
    </div>
  );
};

export default Slider;