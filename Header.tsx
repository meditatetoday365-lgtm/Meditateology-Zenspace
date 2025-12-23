
import React from 'react';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-full opacity-80 blur-[2px]"></div>
            <span className="text-2xl font-serif font-bold tracking-tight text-stone-800">
              Meditateology
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#sessions" className="text-stone-600 hover:text-teal-700 font-medium transition-colors">Sessions</a>
            <a href="#breathing" className="text-stone-600 hover:text-teal-700 font-medium transition-colors">Breathing</a>
            <a href="#ai-coach" className="text-stone-600 hover:text-teal-700 font-medium transition-colors">AI Guide</a>
            <button className="bg-stone-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-stone-800 transition-all transform hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>

          <div className="md:hidden">
            <button className="p-2 text-stone-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
