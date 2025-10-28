

import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'info' | 'error';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mount animation
    setIsVisible(true);
    // Unmount animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Allow time for fade-out animation before calling onClose
      setTimeout(onClose, 300);
    }, 4700);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeClasses = {
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
    error: "bg-red-500 text-white",
  }[type];

  const visibilityClasses = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';
  
  const icon = {
    success: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    info: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    error: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  }[type];


  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 max-w-sm w-full p-4 rounded-xl shadow-lg flex items-center space-x-4 transition-all duration-300 ease-in-out z-50 ${typeClasses} ${visibilityClasses}`} role="alert">
      <div>
        {icon}
      </div>
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto p-1 rounded-full hover:bg-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};