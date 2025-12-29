import React, { useState, useRef, useEffect } from 'react';
import { MeditationSession } from './types';
import { generateMeditationScript, generateSpeech } from './geminiService';

const SESSIONS: MeditationSession[] = [
  { id: '1', title: 'Deep Sleep', duration: '15 min', category: 'Sleep', description: 'Surrender to the night with gentle visualization.', image: 'https://images.unsplash.com/photo-1511295742364-917535761c33?auto=format&fit=crop&q=80&w=600' },
  { id: '2', title: 'Morning Clarity', duration: '10 min', category: 'Focus', description: 'Set your intention for a productive day ahead.', image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&q=80&w=600' },
  { id: '3', title: 'Stress Dissolve', duration: '5 min', category: 'Stress', description: 'A quick reset for high-pressure moments.', image: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf477?auto=format&fit=crop&q=80&w=600' },
  { id: '4', title: 'Mountain Silence', duration: '20 min', category: 'Calm', description: 'Ancient peak meditation for grounded presence.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600' },
  { id: '5', title: 'Creative Flow', duration: '12 min', category: 'Focus', description: 'Unlock the pathways of your inner artist.', image: 'https://images.unsplash.com/photo-1499750310117-5995282fe530?auto=format&fit=crop&q=80&w=600' },
  { id: '6', title: 'Gentle Heart', duration: '10 min', category: 'Calm', description: 'Loving-kindness for self and others.', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600' },
];

const MeditationLibrary: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [activeSession, setActiveSession] = useState<MeditationSession | null>(null);
  const [sessionScript, setSessionScript] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const categories = ['All', 'Focus', 'Calm', 'Sleep', 'Stress'];

  const filteredSessions = filter === 'All' 
    ? SESSIONS 
    : SESSIONS.filter(s => s.category === filter);

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const startSession = async (session: MeditationSession) => {
    setActiveSession(session);
    setIsLoading(true);
    setSessionScript('');
    stopAudio(); 
    
    const prompt = `the session "${session.title}" focusing on ${session.category}. ${session.description}`;
    const script = await generateMeditationScript(prompt, session.duration);
    setSessionScript(script);
    setIsLoading(false);

    setIsAudioLoading(true);
    const audioData = await generateSpeech(script);
    setIsAudioLoading(false);

    if (audioData) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      try {
        const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
        audioSourceRef.current = source;
      } catch (e) {
        console.error("Playback Error:", e);
      }
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch (e) {}
      audioSourceRef.current = null;
    }
  };

  const closeSession = () => {
    stopAudio();
    setActiveSession(null);
    setSessionScript('');
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <section id="sessions" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-brand-dark">Guided Library</h2>
            <p className="text-stone-600 mt-2">Curated journeys for every state of mind.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-brand-dark text-white shadow-lg' : 'bg-white text-stone-500 border border-stone-200 hover:border-brand-primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => (
            <div key={session.id} onClick={() => startSession(session)} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 border-2 border-transparent group-hover:border-brand-primary/20">
                <img src={session.image} alt={session.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-brand-primary/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">{session.category}</div>
                <div className="absolute bottom-4 right-4 bg-brand-dark/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white">{session.duration}</div>
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{session.title}</h3>
              <p className="text-stone-500 text-sm mt-1 leading-relaxed">{session.description}</p>
            </div>
          ))}
        </div>
      </div>

      {activeSession && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-xl animate-fade-in">
          <div className="max-w-2xl w-full bg-brand-light rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl relative border border-white/20">
            <button onClick={closeSession} className="absolute top-8 right-8 text-stone-400 hover:text-brand-dark transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div className="mb-8">
              <span className="text-brand-primary font-bold tracking-widest uppercase text-[10px] mb-2 block">Practice Mode</span>
              <h2 className="text-3xl font-serif font-bold text-brand-dark">{activeSession.title}</h2>
            </div>
            <div className="relative w-32 h-32 mx-auto mb-12">
               <div className={`pulse-ring ${isAudioLoading ? 'bg-amber-500/20 animate-pulse' : 'bg-brand-primary/20'}`}></div>
               <div className="relative w-full h-full rounded-full bg-white shadow-xl flex items-center justify-center border border-brand-primary/10">
                  {isLoading || isAudioLoading ? (
                    <svg className="animate-spin h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <div className="flex gap-1 items-end"><div className="w-1 h-4 bg-brand-primary/40 animate-bounce"></div><div className="w-1 h-8 bg-brand-primary animate-bounce delay-100"></div><div className="w-1 h-6 bg-brand-primary/60 animate-bounce delay-200"></div></div>
                  )}
               </div>
            </div>
            <div className="min-h-[200px] max-h-[300px] overflow-y-auto font-serif text-stone-700 italic leading-relaxed px-6 text-left pb-8 custom-scrollbar">
              {isLoading ? "Summoning stillness..." : sessionScript}
              {isAudioLoading && <p className="text-brand-primary text-xs mt-4 animate-pulse uppercase tracking-widest font-sans font-bold text-center">Mastering Audio...</p>}
            </div>
            <div className="mt-8 pt-8 border-t border-brand-primary/10"><button onClick={closeSession} className="bg-brand-dark text-white px-12 py-3 rounded-full font-bold hover:bg-brand-primary transition-all shadow-lg active:scale-95">End Session</button></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MeditationLibrary;