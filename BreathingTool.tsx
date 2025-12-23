import React, { useState, useEffect } from 'react';
import { BreathingState } from './types';

const BreathingTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingState>('Idle');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isActive) {
      const cycle = async () => {
        setPhase('Inhale');
        setTimer(4);
        await new Promise(r => setTimeout(r, 4000));
        
        setPhase('Hold');
        setTimer(4);
        await new Promise(r => setTimeout(r, 4000));

        setPhase('Exhale');
        setTimer(4);
        await new Promise(r => setTimeout(r, 4000));

        setPhase('Pause');
        setTimer(4);
        await new Promise(r => setTimeout(r, 4000));

        if (isActive) cycle();
      };
      cycle();
    } else {
      setPhase('Idle');
    }

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <section id="breathing" className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Breathing Space</h2>
        <p className="text-stone-600 mb-16">Sync your breath to calm the nervous system.</p>

        <div className="relative flex items-center justify-center h-[400px]">
          {/* Animated Background Rings */}
          <div className={`absolute w-64 h-64 rounded-full border-2 border-teal-200 transition-all duration-[4000ms] ease-in-out ${phase === 'Inhale' ? 'scale-[2] opacity-0' : 'scale-1 opacity-20'}`}></div>
          
          {/* Main Breathing Circle */}
          <div 
            className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-[4000ms] ease-in-out
              ${phase === 'Inhale' ? 'scale-[1.8] bg-teal-500/20' : ''}
              ${phase === 'Exhale' ? 'scale-1 bg-blue-500/20' : ''}
              ${phase === 'Hold' || phase === 'Pause' ? 'scale-[1.8] bg-teal-600/30' : ''}
              ${phase === 'Idle' ? 'bg-stone-200' : ''}
              shadow-inner
            `}
          >
            <div className="text-center z-10">
              <p className="text-2xl font-serif italic text-teal-900 font-bold mb-1">{phase === 'Idle' ? 'Ready?' : phase}</p>
              {!isActive && (
                <button 
                  onClick={() => setIsActive(true)}
                  className="bg-white/50 px-4 py-1 rounded-full text-sm font-medium text-stone-700 hover:bg-white"
                >
                  Start Session
                </button>
              )}
            </div>
          </div>
        </div>

        {isActive && (
          <button 
            onClick={() => setIsActive(false)}
            className="mt-8 text-stone-500 hover:text-stone-800 transition-colors font-medium underline underline-offset-4"
          >
            Stop Session
          </button>
        )}
        
        <div className="mt-12 flex justify-center gap-12 text-stone-400">
           <div className="flex flex-col items-center">
             <span className="text-2xl font-serif text-teal-800">4s</span>
             <span className="text-xs uppercase tracking-widest">Inhale</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-2xl font-serif text-teal-800">4s</span>
             <span className="text-xs uppercase tracking-widest">Hold</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-2xl font-serif text-teal-800">4s</span>
             <span className="text-xs uppercase tracking-widest">Exhale</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default BreathingTool;