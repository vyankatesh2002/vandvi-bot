

import React, { useRef, ChangeEvent } from 'react';
import { User } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAvatarChange: (base64: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onAvatarChange }) => {
  if (!isOpen || !user) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            onAvatarChange(reader.result);
        }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl shadow-cyan-500/10 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close profile"
        >
          <CloseIcon />
        </button>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
            aria-hidden="true"
        />
        <div className="relative group mb-4">
            <button
                onClick={handleAvatarClick}
                className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-cyan-500"
                aria-label="Change profile picture"
            >
                {user.avatar ? (
                    <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                    <UserCircleIcon className="w-20 h-20 text-zinc-600" />
                )}
            </button>
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300 pointer-events-none">
                <p className="text-white text-xs font-bold opacity-0 group-hover:opacity-100">Change</p>
            </div>
        </div>

        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
        <p className="text-zinc-400">{user.email}</p>
        
        <div className="mt-6 w-full text-left space-y-4">
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <h3 className="text-md font-semibold text-cyan-400">Profile Management</h3>
                <p className="text-zinc-400 text-sm mt-1">Click your avatar to upload a new profile picture. Changes are saved locally.</p>
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
