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
    // Linear processing to avoid thread blocking
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
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
      if (ctx.state === 'suspended') await ctx.resume();

      stopAudio(); 

      try {
        const buffer = await decodeAudioData(decodeBase64(audioData), ctx, 24000);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        audioSourceRef.current = source;
        setIsPlaying(true);
      } catch (err) {
        console.error("Narration failed:", err);
      }
    }
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      try { audioSourceRef.current.stop(); } catch (e) {}
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <section id="ai-coach" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-semibold tracking-widest uppercase text-xs">AI Meditation Architect</span>
          <h2 className="text-4xl font-serif font-bold text-brand-dark mt-2">Personalized Guidance</h2>
          <p className="text-stone-600 mt-4">Speak your truth. Let the AI craft a journey for your soul.</p>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden border border-brand-primary/5">
          {isPlaying && (
            <div className="absolute inset-0 bg-brand-primary/5 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 bg-brand-primary/5 rounded-full animate-ping"></div>
              <div className="w-48 h-48 bg-brand-primary/10 rounded-full animate-pulse absolute"></div>
            </div>
          )}

          {!script ? (
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Inner State</label>
                <input 
                  type="text"
                  placeholder="e.g. Grateful but overwhelmed..."
                  className="w-full bg-brand-light border border-stone-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all shadow-inner"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Journey Length</label>
                <div className="flex gap-4">
                  {['3 minute', '5 minute', '10 minute'].map((d) => (
                    <button key={d} onClick={() => setDuration(d)} className={`flex-1 py-3 rounded-xl border transition-all font-bold text-sm ${duration === d ? 'bg-brand-primary text-white border-brand-primary shadow-lg' : 'bg-white text-stone-600 border-stone-200 hover:border-brand-primary'}`}>{d}</button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading || !mood}
                className="w-full bg-brand-dark text-white py-5 rounded-2xl font-bold hover:bg-brand-primary disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {loading ? "Invoking Zen Master..." : "Begin Creation"}
              </button>
            </div>
          ) : (
            <div className="animate-fade-in relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-brand-primary/10 pb-8">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-brand-dark italic">Your Sanctuary Script</h3>
                  <p className="text-[10px] text-brand-primary uppercase tracking-[0.3em] mt-1 font-bold">Unique AI Generation</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <button 
                    onClick={isPlaying ? stopAudio : playAudio}
                    disabled={isAudioLoading}
                    className={`flex-1 md:flex-none px-8 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isPlaying ? 'bg-red-500 text-white' : 'bg-brand-primary text-white hover:bg-brand-dark'}`}
                   >
                     {isAudioLoading ? "Preparing..." : isPlaying ? "Stop Master" : "Hear Zen Master"}
                   </button>
                   <button onClick={() => { stopAudio(); setScript(null); }} className="px-4 py-3 text-stone-400 hover:text-stone-600 text-[10px] font-bold uppercase tracking-widest">Reset</button>
                </div>
              </div>
              
              <div className="bg-brand-light/70 backdrop-blur rounded-3xl p-8 text-stone-700 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto font-serif italic shadow-inner custom-scrollbar border border-white">
                {script}
              </div>

              <div className="mt-8 flex justify-center">
                 <button className="bg-white border border-stone-200 text-stone-700 px-10 py-3 rounded-full text-xs font-bold hover:border-brand-primary transition-all shadow-sm active:scale-95">Share This Journey</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AICoach;