
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-8 relative shadow-2xl shadow-cyan-500/10 text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <div className="text-zinc-400 text-sm">{message}</div>
        </div>
        
        <div className="mt-6 flex gap-3">
             <button 
                onClick={onClose}
                className="flex-1 px-4 py-2 text-center text-white font-semibold bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={onConfirm}
                className="flex-1 px-4 py-2 text-center text-white font-semibold bg-red-600 rounded-md hover:bg-red-500 transition-colors"
            >
                Delete
            </button>
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
