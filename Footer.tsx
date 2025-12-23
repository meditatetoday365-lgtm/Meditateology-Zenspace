
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-teal-500 rounded-full"></div>
            <span className="text-2xl font-serif font-bold text-white">Meditateology</span>
          </div>
          <p className="max-w-sm mb-8">
            Democratizing mindfulness through the fusion of technology and heart-centered practice. Your journey inwards begins here.
          </p>
          <div className="flex gap-4">
             {/* Simple Social Icons */}
             {[1,2,3,4].map(i => (
               <div key={i} className="w-10 h-10 rounded-full bg-stone-800 hover:bg-teal-600 transition-colors cursor-pointer"></div>
             ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Practice</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Guided Meditations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Breathing Techniques</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sleep Stories</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Mindful Movement</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Our Mission</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-16 mt-16 border-t border-stone-800 text-xs text-center">
        &copy; {new Date().getFullYear()} Meditateology. Crafted for inner peace.
      </div>
    </footer>
  );
};

export default Footer;
