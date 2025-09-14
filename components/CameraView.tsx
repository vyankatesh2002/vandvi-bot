import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { Mood } from '../types';

interface CameraViewProps {
  onClose: () => void;
  mood: Mood;
}

const moodEmojis: Record<Mood, string> = {
  happy: '😊',
  sad: '😢',
  surprised: '😮',
  neutral: '😐',
};

export const CameraView: React.FC<CameraViewProps> = ({ onClose, mood }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let isMounted = true;
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (isMounted && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onClose(); // Close view if permission is denied
      }
    };
    enableCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  return (
    <div className="fixed bottom-28 right-6 w-32 h-32 md:w-40 md:h-40 z-20 animate-fade-in">
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/20 bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]" // Mirrored view
        />
        <div 
          key={mood}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-auto px-3 py-1 bg-black/50 rounded-full text-white text-xs backdrop-blur-sm flex items-center gap-1.5 animate-mood-pop-in"
        >
          <span>{moodEmojis[mood]}</span>
          <span className="capitalize font-medium">{mood}</span>
        </div>
      </div>
       <button 
          onClick={onClose}
          className="absolute -top-1 -right-1 bg-zinc-800 text-white rounded-full p-1 border-2 border-zinc-900 hover:bg-red-500 transition-colors"
          aria-label="Close camera view"
        >
          <CloseIcon />
        </button>
         <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes mood-pop-in {
          from { opacity: 0; transform: translateY(8px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-mood-pop-in {
          animation: mood-pop-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
};
