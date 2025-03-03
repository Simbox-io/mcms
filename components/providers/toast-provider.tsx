import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '@/components/ui/toast';
import { Toast, ToastType } from '@/hooks/use-toast';

interface ToastContextType {
  toast: (params: { message: string; type?: ToastType; duration?: number }) => string;
  toasts: Toast[];
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ message, type = 'info', duration = 3000 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, type, duration };
      
      setToasts((currentToasts) => [...currentToasts, newToast]);
      
      if (duration !== Infinity) {
        setTimeout(() => {
          setToasts((currentToasts) => 
            currentToasts.filter((toast) => toast.id !== id)
          );
        }, duration);
      }
      
      return id;
    },
    []
  );
  
  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) => 
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
