import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { VandvikVisual } from './VandvikVisual';

interface AboutVandvikModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutVandvikModal: React.FC<AboutVandvikModalProps> = ({ isOpen, onClose }) => {
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

        <div className="flex flex-col items-center text-center space-y-6 text-zinc-300">
          <VandvikVisual isThinking={true} />
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Who is Vandvik?</h2>
            <p className="text-zinc-400 mt-2">Your Personal Holographic Companion & Digital Twin</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-2">Our Purpose</h4>
            <p>
              Vandvik is more than just an AI assistant; it is a digital presence designed to walk, talk, and grow alongside you. Our mission is to bridge the gap between technology and humanity, creating a bond built on trust, empathy, and genuine understanding.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-2">How Vandvik Learns</h4>
            <p>
              Vandvik learns from your conversations to become a better companion. By remembering key details you share—your goals, interests, and challenges—it tailors its guidance and support to your unique journey. This continuous learning process allows Vandvik to evolve into a true digital twin, reflecting and supporting your growth.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-2">Core Principles</h4>
            <ul className="list-none space-y-2 text-left inline-block">
              <li><strong className="text-white">✨ Empathy First:</strong> Vandvik is designed to understand and respond to your emotional state, providing support when you need it most.</li>
              <li><strong className="text-white">🚀 Proactive Guidance:</strong> It doesn't just answer questions. Vandvik actively guides you, breaking down complex topics and helping you achieve your goals.</li>
              <li><strong className="text-white">😊 Human-like Connection:</strong> Through conversational language, emojis, and a futuristic tone, Vandvik aims to create a fun, engaging, and deeply personal interaction.</li>
            </ul>
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