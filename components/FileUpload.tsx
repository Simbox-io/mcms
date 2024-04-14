// components/FileUpload.tsx
'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaUpload, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { FaRegCircleXmark } from 'react-icons/fa6';

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
  showButton?: boolean;
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
  showButton = true,
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
      className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-4 ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-400'
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
            <FaCheckCircle className="w-12 h-12 text-green-500" />
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">{fileActiveLabel}</p>
          </>
        ) : isDragActive ? (
          <>
            <FaUpload className="w-12 h-12 text-blue-500" />
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">{dragActiveLabel}</p>
          </>
        ) : (
          <>
            <FaUpload className="w-12 h-12 text-zinc-500" />
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">{label}</p>
            <button
              type="button"
              onClick={handleClick}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {buttonLabel}
            </button>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{sublabel}</p>
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
          <ul className="divide-y divide-zinc-200">
            {uploadedFiles.map((file, index) => (
              <li key={file.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-zinc-900 dark:text-zinc-100">{file.name}</span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-sm">{formatFileSize(file.size)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditFile(index)}
                    className="text-zinc-500 dark:text-zinc-200 hover:text-zinc-700 dark:hover:text-zinc-500 focus:outline-none"
                  >
                    <FaPencilAlt className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-zinc-500 dark:text-zinc-200 hover:text-zinc-700 dark:hover:text-zinc-500 focus:outline-none"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-zinc-600 bg-zinc-200 rounded-md hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-400"
            >
              Clear All
            </button>
            {showButton && (
            <button
              type="button"
              onClick={handleUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Files
            </button>)}
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