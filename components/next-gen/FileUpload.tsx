'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  accept = '*',
  multiple = false,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
      onFileChange(files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileChange(updatedFiles.length > 0 ? new FileList(updatedFiles) : null);
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Choose File
      </motion.button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-2"
        >
          {selectedFiles.map((file, index) => (
            <div
              key={file.name}
              className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-md dark:bg-gray-800"
            >
              <span className="text-sm text-gray-800 dark:text-gray-200">{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FileUpload;