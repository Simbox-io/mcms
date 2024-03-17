// components/Drawer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const drawerVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <motion.div
      className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={drawerVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold">Menu</h2>
        <button
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          onClick={onClose}
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <div className="px-4 py-2">{children}</div>
    </motion.div>
  );
};

export default Drawer;