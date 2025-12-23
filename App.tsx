import React, { useEffect } from 'react';

// Corrected paths to match your folder structure
import Header from './components/Header';
import Hero from './components/Hero';
import BreathingTool from './components/BreathingTool';
import MeditationLibrary from './components/MeditationLibrary';
import AICoach from './components/AICoach';
import Footer from './components/Footer';
import LiveZenGuide from './components/LiveZenGuide';
import MobileNavBar from './components/MobileNavBar';
import LeadCapture from './components/LeadCapture';
import NotificationBanner from './components/NotificationBanner';
import AdminLaunchDashboard from './components/AdminLaunchDashboard';

function App() {
  useEffect(() => {
    const visits = parseInt(localStorage.getItem('visitCount') || '0');
    localStorage.setItem('visitCount', (visits + 1).toString());
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Header />
      <main>
        <Hero />
        
        <section className="py-20 bg-stone-100 border-y border-stone-200">
           <div className="max-w-4xl mx-auto px-4 text-center">
              <svg className="w-12 h-12 text-teal-500/30 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L22.017 3V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.0166 21L3.0166 18C3.0166 16.8954 3.91203 16 5.0166 16H8.0166C8.56888 16 9.0166 15.5523 9.0166 15V9C9.0166 8.44772 8.56888 8 8.0166 8H5.0166C3.91203 8 3.0166 7.10457 3.0166 6V3L11.0166 3V15C11.0166 18.3137 8.3303 21 5.0166 21H3.0166Z" />
              </svg>
              <h2 className="text-2xl md:text-4xl font-serif italic text-stone-800 leading-snug">
                "The quiet mind is all you need. All else will happen rightly, once your mind is quiet."
              </h2>
              <p className="mt-6 text-stone-500 font-medium tracking-widest uppercase text-xs">— Sri Nisargadatta Maharaj</p>
           </div>
        </section>

        <MeditationLibrary />
        <BreathingTool />
        <AICoach />
        <LeadCapture />

        <section className="py-24 bg-teal-900 text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-white rounded-[50%] blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 relative flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <span className="text-teal-400 font-bold tracking-widest uppercase text-xs">Take Peace Everywhere</span>
              <h2 className="text-4xl font-serif font-bold mt-4 mb-6 leading-tight">Install Meditateology on your phone.</h2>
              <p className="text-teal-100 text-lg mb-8 leading-relaxed">
                Experience seamless mindfulness. No app store needed—just tap "Add to Home Screen" in your browser menu and use it anywhere, even offline.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-left">
                  <p className="text-xs uppercase tracking-widest text-teal-300 font-bold mb-2">iPhone (Safari)</p>
                  <p className="text-sm">Tap <span className="inline-block px-2 py-0.5 bg-white/20 rounded">Share</span> then "Add to Home Screen"</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-left">
                  <p className="text-xs uppercase tracking-widest text-teal-300 font-bold mb-2">Android (Chrome)</p>
                  <p className="text-sm">Tap <span className="inline-block px-2 py-0.5 bg-white/20 rounded">⋮</span> then "Install app"</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 relative flex justify-center mt-12 md:mt-0">
               <div className="w-64 h-[500px] bg-stone-900 rounded-[3rem] border-[8px] border-stone-800 shadow-2xl relative overflow-hidden transform md:rotate-6 hover:rotate-0 transition-transform duration-700">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-stone-800 rounded-b-2xl z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" 
                    alt="Mobile App Interface" 
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900 to-transparent flex items-end p-6">
                    <p className="text-xl font-serif italic">Your personal Master, in your pocket.</p>
                  </div>
               </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <LiveZenGuide />
      <MobileNavBar />
      <NotificationBanner />
      <AdminLaunchDashboard />
    </div>
  );
}

export default App;