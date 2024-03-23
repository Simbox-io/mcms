'use client'
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  className?: string;
  barColor?: string;
  barBackgroundColor?: string;
  labelColor?: string;
  height?: string;
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label = '',
  showPercentage = true,
  showValue = false,
  className = '',
  barColor = 'bg-blue-500',
  barBackgroundColor = 'bg-gray-200',
  labelColor = 'text-gray-600 dark:text-gray-400',
  height = 'h-2.5',
  animate = true,
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`w-full ${barBackgroundColor} rounded-full ${height}`}>
        <motion.div
          className={`${barColor} ${height} rounded-full`}
          style={{ width: `${percentage}%` }}
          initial={animate ? { width: 0 } : {}}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        ></motion.div>
      </div>
      {(label || showPercentage || showValue) && (
        <span className={`ml-4 text-sm font-medium ${labelColor}`}>
          {label}
          {showValue && ` ${value}/${max}`}
          {showPercentage && ` (${percentage}%)`}
        </span>
      )}
    </div>
  );
};

export default ProgressBar;