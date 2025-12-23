
import React, { useState } from 'react';
import { generateMeditationScript } from '../services/geminiService';

const AICoach: React.FC = () => {
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('5 minute');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!mood) return;
    setLoading(true);
    const result = await generateMeditationScript(mood, duration);
    setScript(result);
    setLoading(false);
  };

  return (
    <section id="ai-coach" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-teal-600 font-semibold tracking-widest uppercase text-xs">Personalized Guidance</span>
          <h2 className="text-4xl font-serif font-bold text-stone-900 mt-2">Your AI Mindfulness Guide</h2>
          <p className="text-stone-600 mt-4">Describe your current state, and let AI craft a unique meditation script just for you.</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-xl">
          {!script ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">How are you feeling today?</label>
                <input 
                  type="text"
                  placeholder="e.g. Anxious about work, restless, grateful..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Duration</label>
                <div className="flex gap-4">
                  {['3 minute', '5 minute', '10 minute'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 rounded-lg border transition-all ${duration === d ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-stone-600 border-stone-200 hover:border-teal-300'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !mood}
                className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating your journey...
                  </>
                ) : 'Craft My Meditation'}
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif font-bold text-teal-800">Your Personalized Script</h3>
                <button 
                  onClick={() => setScript(null)}
                  className="text-stone-400 hover:text-stone-600 text-sm font-medium"
                >
                  Start Over
                </button>
              </div>
              <div className="bg-stone-50 rounded-xl p-6 text-stone-700 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto font-serif">
                {script}
              </div>
              <div className="mt-6 flex justify-center">
                 <button className="bg-teal-700 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-800">
                   Save to Favorites
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AICoach;
