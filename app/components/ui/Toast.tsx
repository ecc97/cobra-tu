'use client';

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

const toastIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const toastColors = {
  success: 'bg-secondary/90 text-black',
  error: 'bg-error/90 text-white',
  info: 'bg-primary/90 text-white',
};

export function Toast({
  message,
  type,
  duration = 3000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 text-sm sm:text-base ${toastColors[type]}`}
    >
      <span className="font-bold text-base sm:text-lg">{toastIcons[type]}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}
