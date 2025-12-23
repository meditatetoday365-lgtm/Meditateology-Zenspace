
import React, { useState } from 'react';
import { MeditationSession } from '../types';

const SESSIONS: MeditationSession[] = [
  { id: '1', title: 'Deep Sleep', duration: '15 min', category: 'Sleep', description: 'Surrender to the night with gentle visualization.', image: 'https://picsum.photos/seed/sleep1/600/400' },
  { id: '2', title: 'Morning Clarity', duration: '10 min', category: 'Focus', description: 'Set your intention for a productive day ahead.', image: 'https://picsum.photos/seed/focus1/600/400' },
  { id: '3', title: 'Stress Dissolve', duration: '5 min', category: 'Stress', description: 'A quick reset for high-pressure moments.', image: 'https://picsum.photos/seed/stress1/600/400' },
  { id: '4', title: 'Mountain Silence', duration: '20 min', category: 'Calm', description: 'Ancient peak meditation for grounded presence.', image: 'https://picsum.photos/seed/mountain1/600/400' },
  { id: '5', title: 'Creative Flow', duration: '12 min', category: 'Focus', description: 'Unlock the pathways of your inner artist.', image: 'https://picsum.photos/seed/creative1/600/400' },
  { id: '6', title: 'Gentle Heart', duration: '10 min', category: 'Calm', description: 'Loving-kindness for self and others.', image: 'https://picsum.photos/seed/heart1/600/400' },
];

const MeditationLibrary: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Focus', 'Calm', 'Sleep', 'Stress'];

  const filteredSessions = filter === 'All' 
    ? SESSIONS 
    : SESSIONS.filter(s => s.category === filter);

  return (
    <section id="sessions" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-stone-900">Guided Library</h2>
            <p className="text-stone-600 mt-2">Curated journeys for every state of mind.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-stone-900 text-white' : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => (
            <div key={session.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                <img 
                  src={session.image} 
                  alt={session.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-teal-800">
                  {session.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white">
                  {session.duration}
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
                {session.title}
              </h3>
              <p className="text-stone-500 text-sm mt-1 leading-relaxed">
                {session.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeditationLibrary;
