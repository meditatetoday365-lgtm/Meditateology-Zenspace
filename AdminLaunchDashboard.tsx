
import React, { useState, useEffect } from 'react';

type Tab = 'roadmap' | 'glossary' | 'assumptions';

const AdminLaunchDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('roadmap');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[200] bg-stone-800/10 hover:bg-stone-800/90 text-[9px] hover:text-[11px] text-stone-400 hover:text-white px-3 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-stone-600 uppercase tracking-tighter"
      >
        Admin Dashboard
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] bg-stone-900/95 backdrop-blur-md p-4 md:p-6 overflow-y-auto flex items-start justify-center">
      <div className="max-w-3xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-teal-600 font-bold tracking-widest uppercase text-[10px] mb-2 block">Meditateology HQ</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900">Owner's Command Center</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="bg-stone-100 p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-stone-100 p-1.5 rounded-2xl">
          {(['roadmap', 'glossary', 'assumptions'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-teal-700 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab Content: Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-serif font-bold text-stone-800 mb-4">Your Path to Launch</h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Upload to GitHub', desc: 'Create a free GitHub account and upload this project folder. This is your master "Safe".' },
                { step: 2, title: 'Connect to Vercel', desc: 'Login to Vercel with your GitHub. It will "pull" the code and give you a live URL.' },
                { step: 3, title: 'DNS Setup', desc: 'Connect meditateology.com in Vercel settings. This makes you "Official".' }
              ].map((item) => (
                <div key={item.step} className="bg-stone-50 p-5 rounded-2xl border border-stone-100 flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0 font-bold text-sm">{item.step}</div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Glossary */}
        {activeTab === 'glossary' && (
          <div className="space-y-4 animate-fade-in">
             {[
               { term: 'Repository', def: 'The "Project Folder" for your website. It contains every piece of code, image, and text.' },
               { term: 'GitHub', def: 'A website that stores your Repository. It tracks every change so you can never "lose" your work.' },
               { term: 'Deployment', def: 'The process of taking code from your "Safe" (GitHub) and putting it on a "Shelf" (Vercel) so the public can see it.' },
               { term: 'Frontend', def: 'Everything you see and touch. Buttons, colors, and animations. This is what we built.' },
               { term: 'Backend', def: 'The hidden machinery (like a Database) that stores user accounts and passwords.' }
             ].map((item) => (
               <div key={item.term} className="p-4 border-b border-stone-100 last:border-0">
                 <h4 className="font-bold text-teal-700 text-xs uppercase tracking-widest mb-1">{item.term}</h4>
                 <p className="text-sm text-stone-600">{item.def}</p>
               </div>
             ))}
          </div>
        )}

        {/* Tab Content: Assumptions */}
        {activeTab === 'assumptions' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
              <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                The "Fine Print"
              </h4>
              <ul className="space-y-4 text-sm text-amber-900/80">
                <li>
                  <strong>AI Costs:</strong> Your "Zen Master" uses the Gemini API. While there is a free tier, you will eventually need to set up a paid Google Cloud account for heavy traffic.
                </li>
                <li>
                  <strong>No Central Database:</strong> If a user clears their browser cache, their "Visit Count" and "Saved Scripts" will disappear. They are stored only on their device (Local Storage).
                </li>
                <li>
                  <strong>Admin Access:</strong> This dashboard is visible to YOU only. When you go live, remember to remove the "Admin Dashboard" button or protect it with a password.
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-stone-100">
           <button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-stone-800 transition-all"
          >
            Return to App
          </button>
          <p className="text-center mt-6 text-[10px] text-stone-400 uppercase tracking-widest italic">
            Tip: Add "?admin=true" to your URL to skip the button.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLaunchDashboard;
