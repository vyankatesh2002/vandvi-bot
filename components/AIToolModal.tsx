import React from 'react';
import { AITool } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { WandIcon } from './icons/WandIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface AIToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: AITool | null;
}

export const AIToolModal: React.FC<AIToolModalProps> = ({ isOpen, onClose, tool }) => {
  if (!isOpen || !tool) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl shadow-cyan-500/10 flex flex-col text-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center">
            <div className="p-3 bg-zinc-800 border border-zinc-700 rounded-full mb-4">
                <WandIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">{tool.name}</h2>
            <p className="text-sm text-zinc-400">by {tool.author}</p>
            <p className="mt-4 text-zinc-300">{tool.description}</p>
        </div>

        <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <h3 className="text-lg font-semibold text-cyan-400">Coming Soon!</h3>
            <p className="text-zinc-400 text-sm mt-1">This feature is currently under development. Stay tuned for updates!</p>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
             <button 
                disabled 
                className="flex-1 px-4 py-2 text-center text-white font-semibold bg-zinc-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Get Started
            </button>
            <a 
                href={`https://${tool.author}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2 text-center text-white font-semibold bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
            >
                Visit {tool.author} <ExternalLinkIcon />
            </a>
        </div>

      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};