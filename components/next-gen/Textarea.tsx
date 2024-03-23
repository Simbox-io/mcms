'use client'
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
  maxLength?: number;
  autoResize?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder = '',
  rows = 3,
  disabled = false,
  className = '',
  maxLength,
  autoResize = false,
}) => {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  const baseClasses =
    'block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent';
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`${baseClasses} ${disabled ? disabledClasses : ''} ${className}`}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {maxLength && (
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {value.length}/{maxLength}
        </div>
      )}
      {focused && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-600"
          layoutId="underline"
        />
      )}
    </motion.div>
  );
};

export default Textarea;