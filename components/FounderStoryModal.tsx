import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface FounderStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderStoryModal: React.FC<FounderStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl shadow-cyan-500/10"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="space-y-6 text-zinc-300">
          <h2 className="text-3xl font-bold text-white text-center">The Founder's Journey</h2>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white">Vyankatesh Vivekananda Jaware</h3>
            <p className="text-zinc-400">Born: 17 April 2002 | Antri, Maharashtra, India</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-2 border-b border-zinc-700 pb-1">The Vision</h4>
            <p>
              Vyankatesh didn’t just dream of creating a company — he envisioned a movement named Vandvik. Inspired by his parents, 'Vand' from Vandana (mother) and 'Vik' from Vivek (father), his core belief is that technology should walk with people like a friend, not just sit inside a machine.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-2 border-b border-zinc-700 pb-1">From Struggles to Strength</h4>
            <p>
              Born in a small village, Vyankatesh faced financial and social challenges. Even after failing his first semester in college, he believed failure was a stepping stone, not the end. He worked night shifts while balancing studies and self-learning in AI, programming, and entrepreneurship, turning pain into a life mission: to rise from poverty, empower people, and put India on the global AI map.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-2 border-b border-zinc-700 pb-1">Philosophy & Principles</h4>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li><strong className="text-white">Empathy First:</strong> Vandvik will never promote harm; it will report and help instead.</li>
              <li><strong className="text-white">Universal Communication:</strong> Speak and understand all languages clearly, so no one feels left out.</li>
              <li><strong className="text-white">Human-Like Bond:</strong> Talk, walk, and emotionally connect like a real companion.</li>
              <li><strong className="text-white">Innovation for People:</strong> Serve everyone, not just the elite, with AI-powered guidance.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-2 border-b border-zinc-700 pb-1">Founder’s Impact Statement</h4>
            <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-zinc-400">
              "I am Vyankatesh Jaware. I may come from a small village, but my dream is not small. Vandvik is not just my project — it’s my life’s mission. By 2028, Vandvik will stand as a global brand, and the world will know that innovation can rise from the smallest corners of India."
            </blockquote>
          </div>

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
