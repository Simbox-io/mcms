// components/FileUpload.tsx
'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import CheckCircleIcon from './icons/CheckCircleIcon';
import UploadIcon from './icons/UploadIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import XCircleIcon from './icons/XCircleIcon';

interface FileUploadProps {
  onFileSelect: (files: FileList | null) => void;
  onFileUpload: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  className?: string;
  label?: string;
  sublabel?: string;
  buttonLabel?: string;
  dragActiveLabel?: string;
  fileActiveLabel?: string;
  id?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileUpload,
  accept = '*',
  maxFiles = 10,
  className = '',
  label = 'Drag and drop files here or',
  sublabel = 'Upload up to 10 files',
  buttonLabel = 'Browse Files',
  dragActiveLabel = 'Drop the files here',
  fileActiveLabel = 'Files uploaded',
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files);
      if (filesArray.length <= maxFiles) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...filesArray]);
        onFileSelect(files);
      } else {
        alert(`You can only upload up to ${maxFiles} files.`);
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const files = event.dataTransfer.files;
    if (files) {
      const filesArray = Array.from(files);
      if (filesArray.length <= maxFiles) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...filesArray]);
        onFileSelect(files);
      } else {
        alert(`You can only upload up to ${maxFiles} files.`);
      }
    }
  };
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleEditFile = (index: number) => {
    // Implement your file editing logic here
    // You can show a modal or a form to allow users to edit the file details
    console.log(`Editing file at index ${index}`);
  };

  const handleUpload = () => {
    onFileUpload(uploadedFiles);
  };

  const handleClearAll = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative border-2 bg-white dark:bg-gray-700 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-4 ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-400 bg-gray-100'
      } ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={maxFiles > 1}
        onChange={handleFileChange}
        className="sr-only"
        id={id}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-2"
      >
        {uploadedFiles.length > 0 ? (
          <>
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{fileActiveLabel}</p>
          </>
        ) : isDragActive ? (
          <>
            <UploadIcon className="w-12 h-12 text-blue-500" />
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{dragActiveLabel}</p>
          </>
        ) : (
          <>
            <UploadIcon className="w-12 h-12 text-gray-500" />
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{label}</p>
            <button
              type="button"
              onClick={handleClick}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {buttonLabel}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">{sublabel}</p>
          </>
        )}
      </motion.div>
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full"
        >
          <ul className="divide-y divide-gray-200">
            {uploadedFiles.map((file, index) => (
              <li key={file.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900 dark:text-gray-100">{file.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditFile(index)}
                    className="text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-500 focus:outline-none"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-500 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-500 focus:outline-none"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={handleUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Files
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default FileUpload;