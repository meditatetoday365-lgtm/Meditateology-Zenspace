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

  // Helper: Decode Base64 to Uint8Array
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Helper: Decode Raw PCM Audio Data
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const startSession = async (session: MeditationSession) => {
    setActiveSession(session);
    setIsLoading(true);
    setSessionScript('');
    
    // 1. Generate the Text Script
    const prompt = `the session "${session.title}" which focuses on ${session.category}. Topic description: ${session.description}`;
    const script = await generateMeditationScript(prompt, session.duration);
    setSessionScript(script);
    setIsLoading(false);

    // 2. Generate and Play the Audio
    setIsAudioLoading(true);
    const audioData = await generateSpeech(script);
    setIsAudioLoading(false);

    if (audioData) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
      audioSourceRef.current = source;
    }
  };

  const closeSession = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
    }
    setActiveSession(null);
    setSessionScript('');
    setIsAudioLoading(false);
  };

  return (
    <section id="sessions" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold text-brand-dark">Guided Library</h2>
            <p className="text-stone-600 mt-2">Choose a journey. The Zen Master will guide you.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-brand-dark text-white' : 'bg-white text-stone-500 border border-stone-200 hover:border-brand-primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => (
            <div 
              key={session.id} 
              onClick={() => startSession(session)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500 border border-transparent group-hover:border-brand-primary/20">
                <img 
                  src={session.image} 
                  alt={session.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-95 group-hover:brightness-100" 
                />
                <div className="absolute top-4 left-4 bg-brand-primary/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                  {session.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-brand-dark/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-white">
                  {session.duration}
                </div>
                <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-6 h-6 text-brand-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                {session.title}
              </h3>
              <p className="text-stone-500 text-sm mt-1 leading-relaxed">
                {session.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MEDITATION PLAYER MODAL */}
      {activeSession && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-xl animate-fade-in">
          <div className="max-w-2xl w-full bg-brand-light rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="p-8 md:p-12 relative text-center">
              <button 
                onClick={closeSession}
                className="absolute top-8 right-8 text-stone-400 hover:text-brand-dark transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-8">
                <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Now Playing</span>
                <h2 className="text-3xl font-serif font-bold text-brand-dark mt-1">{activeSession.title}</h2>
                <p className="text-stone-500 text-sm uppercase tracking-wider mt-1">{activeSession.duration} • AI Directed Experience</p>
              </div>

              <div className="relative w-32 h-32 mx-auto mb-12">
                <div className={`pulse-ring ${isAudioLoading ? 'bg-amber-500/20 animate-pulse' : 'bg-brand-primary/20'}`}></div>
                <div className="relative w-full h-full rounded-full border-2 border-brand-primary/20 flex items-center justify-center bg-white shadow-xl">
                   <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center text-white">
                      {isLoading || isAudioLoading ? (
                        <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 8v8l6-4z" />
                        </svg>
                      )}
                   </div>
                </div>
              </div>

              <div className="min-h-[200px] max-h-[350px] overflow-y-auto font-serif text-stone-700 text-lg italic leading-relaxed px-4 custom-scrollbar">
                {isLoading ? (
                  <div className="space-y-4 opacity-50">
                    <p className="animate-pulse">Preparing your sanctuary...</p>
                  </div>
                ) : (
                  <div className="animate-fade-in whitespace-pre-wrap text-left pb-8">
                    {sessionScript}
                    {isAudioLoading && (
                      <p className="text-brand-primary text-sm mt-4 animate-pulse">Mastering the audio for your soul...</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-brand-primary/10">
                <button 
                  onClick={closeSession}
                  className="bg-brand-dark text-white px-10 py-3 rounded-full font-bold hover:bg-brand-primary transition-all shadow-lg active:scale-95"
                >
                  End Practice
                </button>
                <p className="text-[10px] text-stone-400 mt-4 uppercase tracking-[0.2em]">Close your eyes and breathe</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MeditationLibrary;