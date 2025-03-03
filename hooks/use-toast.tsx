// Re-export from the provider for backward compatibility
import { useToast } from '@/components/providers/toast-provider';
export { useToast };

// Type exports
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
