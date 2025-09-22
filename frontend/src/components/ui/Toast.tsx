'use client'
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Animation duration
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const variants = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-600',
      progress: 'bg-green-600'
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-600',
      progress: 'bg-red-600'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: 'text-yellow-600',
      progress: 'bg-yellow-600'
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-600',
      progress: 'bg-blue-600'
    }
  };

  const Icon = icons[type];
  const variant = variants[type];

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'max-w-sm w-full shadow-lg rounded-xl border backdrop-blur-sm transition-all duration-300 animate-slideIn',
        variant.container,
        isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0',
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('w-5 h-5', variant.icon)} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className={cn('text-sm', title ? 'mt-1' : '')}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className={cn(
                'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant.icon,
                'hover:opacity-75'
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {duration > 0 && (
        <div className="h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div
            className={cn(
              'h-full rounded-b-xl transition-all ease-linear',
              variant.progress
            )}
            style={{
              animation: `toast-progress ${duration}ms linear`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Toast manager utility
class ToastManager {
  private static instance: ToastManager;
  private toasts: ToastProps[] = [];
  private listeners: ((toasts: ToastProps[]) => void)[] = [];

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public show(toast: Omit<ToastProps, 'id' | 'onClose'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: () => this.remove(id)
    };

    this.toasts.push(newToast);
    this.notifyListeners();

    return id;
  }

  public remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  public subscribe(listener: (toasts: ToastProps[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }
}

// Export utilities
export const toast = {
  success: (message: string, options?: Partial<ToastProps>) =>
    ToastManager.getInstance().show({ ...options, type: 'success', message }),
  
  error: (message: string, options?: Partial<ToastProps>) =>
    ToastManager.getInstance().show({ ...options, type: 'error', message }),
  
  warning: (message: string, options?: Partial<ToastProps>) =>
    ToastManager.getInstance().show({ ...options, type: 'warning', message }),
  
  info: (message: string, options?: Partial<ToastProps>) =>
    ToastManager.getInstance().show({ ...options, type: 'info', message }),
};

export default Toast;