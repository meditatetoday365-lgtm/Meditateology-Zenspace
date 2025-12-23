
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-stone-50">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-teal-100 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 leading-tight">
            Find your center in a <br />
            <span className="text-teal-700 italic">restless world.</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Welcome to Meditateology. We combine ancient wisdom with modern AI to guide you on a journey of mindfulness, clarity, and peace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#sessions" className="bg-teal-700 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-teal-800 transition-all transform hover:-translate-y-1">
              Explore Sessions
            </a>
            <a href="#ai-coach" className="bg-white text-stone-900 border border-stone-200 px-8 py-4 rounded-full text-lg font-medium shadow-sm hover:border-stone-400 transition-all transform hover:-translate-y-1">
              Talk to AI Coach
            </a>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
           <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/meditation1/1200/675" 
                alt="Zen Landscape" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-sm font-medium uppercase tracking-widest opacity-80">Today's Focus</p>
                <h3 className="text-2xl font-serif italic">The Art of Stillness</h3>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
