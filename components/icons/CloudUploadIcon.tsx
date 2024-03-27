import React from 'react';

interface CloudUploadIconProps {
  className?: string;
  width?: string;
  height?: string;
  fill?: string;
}

const CloudUploadIcon: React.FC<CloudUploadIconProps> = ({
  className = '',
  width = '24',
  height = '24',
  fill = 'currentColor',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
      width={width}
      height={height}
    >
      <path d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6h.1a5 5 0 0 1 1 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
};

export default CloudUploadIcon;