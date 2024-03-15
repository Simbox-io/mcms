// components/FileUpload.tsx
'use client';
import React, { useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  label?: string;
  buttonClassName?: string;
  dragActiveClassName?: string;
  id?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '*',
  multiple = false,
  className = '',
  label = 'Choose File',
  buttonClassName = '',
  dragActiveClassName = '',
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    onFileSelect(files);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dropzoneRef.current?.classList.add(dragActiveClassName);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dropzoneRef.current?.classList.remove(dragActiveClassName);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dropzoneRef.current?.classList.remove(dragActiveClassName);
    const files = event.dataTransfer.files;
    onFileSelect(files);
  };

  return (
    <div
      ref={dropzoneRef}
      className={`relative ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="sr-only"
      />
      <button
        type="button"
        onClick={handleClick}
        className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${buttonClassName}`}
      >
        {label}
      </button>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Drag and drop files here or click to select files.
      </div>
    </div>
  );
};

export default FileUpload;