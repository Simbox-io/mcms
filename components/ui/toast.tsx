import React from 'react';
import { FiX, FiInfo, FiCheck, FiAlert, FiAlertTriangle } from 'react-icons/fi';
import { Toast, ToastType } from '@/hooks/use-toast';

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastTypeStyles = {
  success: 'bg-green-50 border-green-400 text-green-700',
  error: 'bg-red-50 border-red-400 text-red-700',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-700',
  info: 'bg-blue-50 border-blue-400 text-blue-700'
};

const toastIcons = {
  success: <FiCheck className="text-green-500" size={20} />,
  error: <FiX className="text-red-500" size={20} />,
  warning: <FiAlertTriangle className="text-yellow-500" size={20} />,
  info: <FiInfo className="text-blue-500" size={20} />
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, message, type } = toast;
  
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded border ${toastTypeStyles[type]} shadow-md mb-2 animate-slide-in`}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-3">
          {toastIcons[type]}
        </div>
        <p>{message}</p>
      </div>
      <button 
        onClick={() => onDismiss(id)}
        className="ml-3 text-gray-500 hover:text-gray-600 focus:outline-none"
        aria-label="Close toast"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: Toast[], dismissToast: (id: string) => void }> = ({ 
  toasts, 
  dismissToast 
}) => {
  return (
    <div className="fixed top-0 right-0 p-4 z-50 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
