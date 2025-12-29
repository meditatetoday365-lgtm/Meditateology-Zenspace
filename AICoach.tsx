import React, { useState, useRef, useEffect } from 'react';
import { generateMeditationScript, generateSpeech } from './geminiService';

const AICoach: React.FC = () => {
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('5 minute');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Audio Processing Helpers
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

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

  const handleGenerate = async () => {
    if (!mood) return;
    setLoading(true);
    setScript(null);
    stopAudio();
    const result = await generateMeditationScript(mood, duration);
    setScript(result);
    setLoading(false);
  };

  const playAudio = async () => {
    if (!script) return;
    
    setIsAudioLoading(true);
    const audioData = await generateSpeech(script);
    setIsAudioLoading(false);

    if (audioData) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      // Critical for mobile stability: Resume context on user interaction
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      stopAudio(); // Stop any existing playback

      try {
        const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        audioSourceRef.current = source;
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
      }
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => stopAudio(); // Cleanup on unmount
  }, []);

  const handleShare = async () => {
    if (navigator.share && script) {
      try {
        await navigator.share({
          title: 'My Personalized Meditation',
          text: `Check out this ${duration} meditation I just generated on Meditateology for feeling ${mood}:\n\n${script.substring(0, 100)}...`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(script || '');
      alert('Meditation script copied to clipboard!');
    }
  };

  return (
    <section id="ai-coach" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-semibold tracking-widest uppercase text-xs">Personalized Guidance</span>
          <h2 className="text-4xl font-serif font-bold text-brand-dark mt-2">Your AI Mindfulness Guide</h2>
          <p className="text-stone-600 mt-4">Describe your current state, and let AI craft a unique meditation script just for you.</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-xl relative overflow-hidden">
          {isPlaying && (
            <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-brand-primary/10 rounded-full animate-ping opacity-20"></div>
                  <div className="w-48 h-48 bg-brand-primary/10 rounded-full animate-pulse opacity-30 delay-75"></div>
               </div>
            </div>
          )}

          {!script ? (
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">How are you feeling today?</label>
                <input 
                  type="text"
                  placeholder="e.g. Anxious about work, restless, grateful..."
                  className="w-full bg-brand-light border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all shadow-sm"
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
                      className={`flex-1 py-2 rounded-lg border transition-all font-medium ${duration === d ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white text-stone-600 border-stone-200 hover:border-brand-primary'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !mood}
                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-brand-primary disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Invoking Zen Master...
                  </>
                ) : 'Craft My Meditation'}
              </button>
            </div>
          ) : (
            <div className="animate-fade-in relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-brand-primary/10 pb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-brand-primary">Guided Experience</h3>
                  <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Personalized for you</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <button 
                    onClick={isPlaying ? stopAudio : playAudio}
                    disabled={isAudioLoading}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${isPlaying ? 'bg-red-500 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}
                   >
                     {isAudioLoading ? (
                       <div className="flex gap-1 items-center">
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                         <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                       </div>
                     ) : isPlaying ? (
                       <><div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> Stop Narrator</>
                     ) : (
                       <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Hear Zen Master</>
                     )}
                   </button>
                   <button 
                    onClick={() => { stopAudio(); setScript(null); }}
                    className="px-4 py-2 text-stone-400 hover:text-stone-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
                   >
                    New Session
                   </button>
                </div>
              </div>
              
              <div className="bg-brand-light/50 backdrop-blur-sm rounded-2xl p-6 text-stone-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto font-serif relative shadow-inner custom-scrollbar italic">
                {script}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                 <button 
                  onClick={handleShare}
                  className="bg-white border border-stone-200 text-stone-700 px-8 py-3 rounded-full text-sm font-bold hover:border-brand-primary transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                   </svg>
                   Share This Journey
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