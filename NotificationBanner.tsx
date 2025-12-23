
import React, { useState, useEffect } from 'react';

const NotificationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the banner after 5 seconds of browsing
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('notificationDismissed');
      if (!dismissed) setIsVisible(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('notificationDismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:bottom-8 md:right-8 md:left-auto md:w-80 z-[110] animate-bounce-in">
      <div className="glass p-5 rounded-2xl shadow-2xl border border-teal-500/20">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-teal-700 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Mindfulness Reminders</h4>
            <p className="text-xs text-stone-500 mt-1">Receive daily nudges to breathe and stay present.</p>
            <div className="flex gap-3 mt-3">
              <button 
                onClick={handleDismiss}
                className="bg-teal-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-teal-800 transition-colors"
              >
                ENABLE
              </button>
              <button 
                onClick={handleDismiss}
                className="text-stone-400 text-[10px] font-bold px-2 py-2 hover:text-stone-600"
              >
                LATER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;
