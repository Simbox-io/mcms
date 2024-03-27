'use client'
import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  trigger?: 'hover' | 'click';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  tooltipClassName?: string;
  tooltipStyle?: React.CSSProperties;
  arrow?: boolean;
  arrowSize?: number;
  arrowClassName?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  delay = 0,
  className = '',
  style,
  tooltipClassName = '',
  tooltipStyle,
  arrow = true,
  arrowSize = 6,
  arrowClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const placementClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
  };

  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 border-t-0 border-l-transparent border-r-transparent',
    right: 'left-0 top-1/2 transform -translate-y-1/2 border-r-0 border-t-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 border-b-0 border-l-transparent border-r-transparent',
    left: 'right-0 top-1/2 transform -translate-y-1/2 border-l-0 border-t-transparent border-b-transparent',
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      style={style}
      onMouseEnter={trigger === 'hover' ? showTooltip : undefined}
      onMouseLeave={trigger === 'hover' ? hideTooltip : undefined}
      onClick={trigger === 'click' ? () => setIsVisible(!isVisible) : undefined}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 px-3 py-2 text-white bg-gray-900 rounded-md shadow-lg ${placementClasses[placement]} ${tooltipClassName}`}
          style={tooltipStyle}
        >
          {content}
          {arrow && (
            <div
              className={`absolute w-0 h-0 border-solid border-4 border-gray-900 ${arrowClasses[placement]} ${arrowClassName}`}
              style={{ borderWidth: `${arrowSize}px` }}
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tooltip;