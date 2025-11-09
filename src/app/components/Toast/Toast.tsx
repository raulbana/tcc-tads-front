"use client";
import React, { useEffect, useState } from "react";

export type ToastType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';

interface ToastProps {
  type: ToastType;
  message: string;
  isOpen: boolean;
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  isOpen,
  duration = 5000,
  onClose,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        if (onClose) {
          setTimeout(onClose, 300);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!shouldRender) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-500';
      case 'ERROR':
        return 'bg-red-500';
      case 'INFO':
        return 'bg-blue-500';
      case 'WARNING':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${getBackgroundColor()} text-white px-6 py-4 rounded-lg shadow-lg transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-3">
        <p className="font-medium">{message}</p>
        {onClose && (
          <button
            onClick={() => {
              setShouldRender(false);
              if (onClose) {
                setTimeout(onClose, 300);
              }
            }}
            className="text-white hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;

