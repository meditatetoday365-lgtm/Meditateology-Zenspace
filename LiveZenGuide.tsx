import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

const LiveZenGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const decode = (base64: string) => {
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

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const toggleSession = async () => {
    if (isConnected) {
      if (sessionRef.current) sessionRef.current.close();
      setIsConnected(false);
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    setIsConnected(true);
    setTranscription('Connecting to the Zen Master...');

    // Robust API key detection
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.VITEGEMINIAPIKEY || '';
    const ai = new GoogleGenAI({ apiKey });
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const outCtx = audioContextRef.current;
    const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'You are a wise, gentle, and compassionate Zen Meditation Master. Your voice is calm. You guide the user through short breathing exercises or provide philosophical comfort. Keep responses relatively short and poetic.',
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setTranscription('I am here. How can I guide you today?');
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsModelSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsModelSpeaking(false);
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsModelSpeaking(false);
            }

            if (message.serverContent?.turnComplete) {
              setTimeout(() => setTranscription(''), 5000);
            }
          },
          onclose: () => setIsConnected(false),
          onerror: (e) => console.error("Zen Guide Error:", e),
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnected(false);
    }
  };

  return (
    <>
      <button 
        onClick={toggleSession}
        className={`fixed bottom-8 right-8 z-[60] w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 ${isConnected ? 'bg-red-500' : 'bg-brand-primary'}`}
      >
        {isConnected ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-md animate-fade-in">
          <div className="text-center max-w-xl w-full">
            <div className="relative w-48 h-48 mx-auto mb-12">
              <div className={`absolute inset-0 rounded-full bg-brand-primary/20 transition-all duration-500 ${isConnected ? 'scale-100' : 'scale-0'}`}></div>
              {isModelSpeaking && <div className="pulse-ring"></div>}
              <div className="relative w-full h-full rounded-full border border-brand-primary/30 flex items-center justify-center bg-brand-dark shadow-2xl">
                 <div className="w-4 h-4 rounded-full bg-brand-primary animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-serif italic text-brand-light mb-4">
              {isConnected ? 'Zen Master is Listening...' : 'Connecting...'}
            </h2>
            
            <div className="min-h-[100px] text-stone-400 font-serif italic text-lg leading-relaxed px-8">
              {transcription || "Speak your heart, or just listen to the silence."}
            </div>

            <button 
              onClick={toggleSession}
              className="mt-12 text-stone-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
            >
              End Meditation Session
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveZenGuide;