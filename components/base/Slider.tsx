'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  labelClassName?: string;
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom';
  labelFormat?: (value: number) => string;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = 0,
  onChange,
  className = '',
  trackClassName = '',
  thumbClassName = '',
  labelClassName = '',
  showLabel = false,
  labelPosition = 'top',
  labelFormat = (value) => value.toString(),
}) => {
  const [sliderValue, setSliderValue] = useState(value || defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setSliderValue(value);
    }
  }, [value]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setSliderValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (sliderRef.current) {
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const clickPosition = event.clientX - sliderRect.left;
      const sliderWidth = sliderRect.width;
      const newValue = min + ((max - min) * clickPosition) / sliderWidth;
      const roundedValue = Math.round(newValue / step) * step;
      setSliderValue(roundedValue);
      if (onChange) {
        onChange(roundedValue);
      }
    }
  };

  const getSliderPosition = () => {
    const percentage = ((sliderValue - min) / (max - min)) * 100;
    return `${percentage}%`;
  };

  return (
    <div className={`slider ${className}`}>
      {showLabel && labelPosition === 'top' && (
        <div className={`label ${labelClassName}`}>{labelFormat(sliderValue)}</div>
      )}
      <div
        ref={sliderRef}
        className={`slider-track ${trackClassName}`}
        onClick={handleSliderClick}
      >
        <motion.div
          className={`slider-thumb ${thumbClassName}`}
          style={{ left: getSliderPosition() }}
          ref={thumbRef}
          drag="x"
          dragConstraints={sliderRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={(event, info) => {
            const sliderRect = sliderRef.current?.getBoundingClientRect();
            if (sliderRect) {
              const newPosition = info.point.x - sliderRect.left;
              const sliderWidth = sliderRect.width;
              const newValue = min + ((max - min) * newPosition) / sliderWidth;
              const roundedValue = Math.round(newValue / step) * step;
              setSliderValue(roundedValue);
              if (onChange) {
                onChange(roundedValue);
              }
            }
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleSliderChange}
        className="sr-only"
      />
      {showLabel && labelPosition === 'bottom' && (
        <div className={`label ${labelClassName}`}>{labelFormat(sliderValue)}</div>
      )}
    </div>
  );
};

export default Slider;