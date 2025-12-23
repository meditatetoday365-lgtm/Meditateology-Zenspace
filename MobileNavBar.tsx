
import React from 'react';

const MobileNavBar: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-stone-200 px-6 py-3 flex justify-between items-center z-[100] pb-safe">
      <a href="#sessions" className="flex flex-col items-center gap-1 text-stone-500 hover:text-teal-700">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-tighter">Library</span>
      </a>
      <a href="#breathing" className="flex flex-col items-center gap-1 text-stone-500 hover:text-teal-700">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-tighter">Breath</span>
      </a>
      <div className="relative -top-6">
        <div className="bg-teal-700 p-4 rounded-full shadow-lg border-4 border-stone-50 text-white">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>
      <a href="#ai-coach" className="flex flex-col items-center gap-1 text-stone-500 hover:text-teal-700">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-tighter">Coach</span>
      </a>
      <button className="flex flex-col items-center gap-1 text-stone-500 hover:text-teal-700">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="text-[10px] font-medium uppercase tracking-tighter">Profile</span>
      </button>
    </div>
  );
};

export default MobileNavBar;
