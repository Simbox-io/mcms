import React, { useRef, useState } from 'react';
import Button from './Button';
import CloudUploadIcon from '../icons/CloudUploadIcon';

interface FileUploadProps {
  onFileSelect: (files: FileList | null) => void;
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  minSize?: number;
  maxFiles?: number;
  label?: string;
  uploadLabel?: string;
  dragActiveLabel?: string;
  className?: string;
  fileClassName?: string;
  dropzoneClassName?: string;
  labelClassName?: string;
  uploadClassName?: string;
  dragActiveClassName?: string;
  errorClassName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onUpload,
  accept = '*',
  multiple = false,
  maxSize = Infinity,
  minSize = 0,
  maxFiles = Infinity,
  label = 'Drag and drop files here or',
  uploadLabel = 'Upload',
  dragActiveLabel = 'Drop the files here',
  className = '',
  fileClassName = '',
  dropzoneClassName = '',
  labelClassName = '',
  uploadClassName = '',
  dragActiveClassName = '',
  errorClassName = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    handleFileSelect(files);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const validFiles: File[] = [];
      const newErrors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > maxSize) {
          newErrors.push(`File "${file.name}" exceeds the maximum size of ${formatSize(maxSize)}.`);
        } else if (file.size < minSize) {
          newErrors.push(`File "${file.name}" is smaller than the minimum size of ${formatSize(minSize)}.`);
        } else {
          validFiles.push(file);
        }
      }

      if (selectedFiles.length + validFiles.length > maxFiles) {
        newErrors.push(`You can only upload a maximum of ${maxFiles} files.`);
      }

      setSelectedFiles([...selectedFiles, ...validFiles]);
      setErrors([...errors, ...newErrors]);
      onFileSelect(files);
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

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const files = event.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      setSelectedFiles([]);
      setErrors([]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div className={`file-upload ${className}`}>
      <div
        className={`dropzone ${dropzoneClassName} ${isDragActive ? dragActiveClassName : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CloudUploadIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className={`text-gray-600 ${labelClassName}`}>
          {isDragActive ? dragActiveLabel : label}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`text-blue-600 underline ml-1 ${uploadClassName}`}
          >
            {uploadLabel}
          </button>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <ul className="divide-y divide-gray-200">
            {selectedFiles.map((file, index) => (
              <li key={file.name} className={`py-3 flex justify-between items-center ${fileClassName}`}>
                <div className="flex items-center">
                  <span className="text-gray-900">{file.name}</span>
                  <span className="ml-2 text-gray-500 text-sm">{formatSize(file.size)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-600 hover:text-red-900 focus:outline-none"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <Button onClick={handleUploadClick} className="mt-4">
            {uploadLabel}
          </Button>
        </div>
      )}
      {errors.length > 0 && (
        <div className={`mt-4 text-red-600 ${errorClassName}`}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

const formatSize = (size: number) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};

export default FileUpload;