
import React, { useState } from 'react';

const LeadCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send this to your Database or Mailchimp
    console.log("Email captured:", email);
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          {!submitted ? (
            <div className="relative z-10">
              <span className="text-teal-600 font-bold tracking-widest uppercase text-[10px] mb-4 block">Inner Circle</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">Daily Zen in your inbox.</h2>
              <p className="text-stone-600 mb-8 max-w-lg mx-auto">
                Join 5,000+ mindful souls. Get exclusive meditations, mental health tips, and early access to new features.
              </p>
              
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  className="flex-1 px-6 py-4 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-teal-700 text-white px-8 py-4 rounded-full font-bold hover:bg-teal-800 transition-all shadow-lg active:scale-95"
                >
                  Join Now
                </button>
              </form>
              <p className="mt-4 text-[10px] text-stone-400 uppercase tracking-widest">No spam. Only peace. Unsubscribe anytime.</p>
            </div>
          ) : (
            <div className="animate-fade-in py-8">
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Welcome to the family.</h2>
              <p className="text-stone-600">Check your inbox for your first guided journey.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;
