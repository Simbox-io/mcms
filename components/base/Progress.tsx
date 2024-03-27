import React from 'react';

interface ProgressProps {
  value: number;
  variant?: 'bar' | 'circle';
  size?: 'small' | 'medium' | 'large';
  thickness?: number;
  color?: string;
  className?: string;
  barClassName?: string;
  circleClassName?: string;
  labelClassName?: string;
  label?: string;
  showPercentage?: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  variant = 'bar',
  size = 'medium',
  thickness = 4,
  color = 'blue',
  className = '',
  barClassName = '',
  circleClassName = '',
  labelClassName = '',
  label,
  showPercentage = false,
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const renderBar = () => (
    <div className={`bg-gray-200 rounded-full h-${thickness} ${className}`}>
      <div
        className={`bg-${color}-500 h-full rounded-full ${barClassName}`}
        style={{ width: `${clampedValue}%` }}
      ></div>
    </div>
  );

  const renderCircle = () => {
    const radius = size === 'small' ? 20 : size === 'medium' ? 30 : 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    return (
      <svg
        className={`transform -rotate-90 ${className}`}
        width={radius * 2}
        height={radius * 2}
      >
        <circle
          className={`text-gray-200 ${circleClassName}`}
          strokeWidth={thickness}
          stroke="currentColor"
          fill="transparent"
          r={radius - thickness / 2}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`text-${color}-500 ${circleClassName}`}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius - thickness / 2}
          cx={radius}
          cy={radius}
        />
      </svg>
    );
  };

  return (
    <div className="flex items-center">
      {variant === 'bar' ? renderBar() : renderCircle()}
      {(label || showPercentage) && (
        <div className={`ml-2 ${labelClassName}`}>
          {label && <span>{label}</span>}
          {showPercentage && <span>{`${clampedValue}%`}</span>}
        </div>
      )}
    </div>
  );
};

export default Progress;