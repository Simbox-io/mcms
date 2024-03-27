import React from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'small' | 'medium' | 'large' | 'full';
  overlay?: boolean;
  className?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  position = 'left',
  size = 'medium',
  overlay = true,
  className = '',
}) => {
  const drawerVariants = {
    open: { x: 0 },
    closed: { x: position === 'left' ? '-100%' : '100%' },
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const sizeClasses = {
    small: 'w-64',
    medium: 'w-80',
    large: 'w-96',
    full: 'w-full',
  };

  return (
    <>
      {overlay && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />
      )}
      <motion.div
        className={`fixed inset-y-0 ${
          position === 'left' ? 'left-0' : 'right-0'
        } z-50 bg-white dark:bg-gray-800 shadow-lg ${sizeClasses[size]} ${className}`}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={drawerVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
            onClick={onClose}
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="px-4 py-2">{children}</div>
      </motion.div>
    </>
  );
};

export default Drawer;