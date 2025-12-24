import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 overflow-hidden bg-brand-light">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[100px] opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-brand-primary/5 border border-brand-primary/10">
            <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">Now Powered by Gemini 3.0</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-brand-dark mb-6 leading-[1.1]">
            Find your center in a <br className="hidden md:block" />
            <span className="text-brand-primary italic">restless world.</span>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Welcome to Meditateology. We combine ancient wisdom with modern AI to guide you on a journey of mindfulness, clarity, and peace.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#sessions" className="bg-brand-primary text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-brand-dark transition-all transform hover:-translate-y-1 active:scale-95">
              Explore Sessions
            </a>
            <a href="#ai-coach" className="bg-white text-brand-dark border border-stone-200 px-8 py-4 rounded-full text-lg font-medium shadow-sm hover:border-brand-primary transition-all transform hover:-translate-y-1 active:scale-95">
              Talk to AI Coach
            </a>
          </div>
        </div>

        <div className="mt-16 md:mt-24 flex justify-center">
           <div className="relative w-full max-w-4xl aspect-[16/9] md:aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200" 
                alt="Zen Landscape" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white text-left">
                <p className="text-[10px] md:text-sm font-medium uppercase tracking-widest text-brand-secondary mb-1">Today's Focus</p>
                <h3 className="text-xl md:text-3xl font-serif italic">The Art of Stillness</h3>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;