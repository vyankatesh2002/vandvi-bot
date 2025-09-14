
import React from 'react';

interface VandvikVisualProps {
  isThinking: boolean;
}

export const VandvikVisual: React.FC<VandvikVisualProps> = ({ isThinking }) => {
  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
      <div 
        className={`absolute rounded-full bg-cyan-500/10 blur-2xl transition-all duration-1000 ${isThinking ? 'w-full h-full animate-pulse' : 'w-3/4 h-3/4'}`}
      />
      <div 
        className={`absolute rounded-full bg-purple-500/10 blur-2xl transition-all duration-1000 delay-300 ${isThinking ? 'w-5/6 h-5/6 animate-pulse' : 'w-1/2 h-1/2'}`}
      />
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border border-cyan-400/20 flex items-center justify-center">
        <div className={`w-full h-full rounded-full transition-transform duration-500 ${isThinking ? 'animate-spin' : ''}`}
          style={{ animationDuration: '10s' }}
        >
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-cyan-400/0 via-cyan-400/50 to-cyan-400/0 -translate-x-1/2" />
          <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 -translate-y-1/2" />
        </div>
        <div className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full bg-slate-900 border-2 border-slate-700/50 shadow-2xl shadow-cyan-500/10 flex items-center justify-center">
           <div className={`w-4 h-4 rounded-full bg-cyan-400 transition-all duration-500 ${isThinking ? 'animate-pulse scale-125' : 'scale-100'}`} />
        </div>
      </div>
    </div>
  );
};
