
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { SoundOnIcon } from './icons/SoundOnIcon';
import { SoundOffIcon } from './icons/SoundOffIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | undefined;
  onVoiceChange: (voiceURI: string) => void;
  speechRate: number;
  onRateChange: (rate: number) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  voices,
  selectedVoiceURI,
  onVoiceChange,
  speechRate,
  onRateChange,
  isSoundEnabled,
  onToggleSound
}) => {
  if (!isOpen) return null;

  const groupedVoices = voices.reduce((acc, voice) => {
    const lang = voice.lang;
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-8 relative shadow-2xl shadow-cyan-500/10"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close settings"
        >
          <CloseIcon />
        </button>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">Settings</h2>

          <div className="border-b border-zinc-800 pb-6 space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">Voice</h3>
             <div className="space-y-2">
              <label htmlFor="voice-select" className="block text-sm font-medium text-zinc-300">
                Vandvik's Voice
              </label>
              <select
                id="voice-select"
                value={selectedVoiceURI || ''}
                onChange={(e) => onVoiceChange(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                {Object.entries(groupedVoices).map(([lang, voiceGroup]) => (
                  <optgroup key={lang} label={lang}>
                    {voiceGroup.map(voice => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="rate-slider" className="block text-sm font-medium text-zinc-300">
                Speech Rate: <span className="font-bold text-white">{speechRate.toFixed(1)}x</span>
              </label>
              <input
                id="rate-slider"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => onRateChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-cyan-400">General</h3>
            <div className="flex items-center justify-between">
                <label htmlFor="sound-toggle" className="text-sm font-medium text-zinc-300">
                    UI Sound Effects
                </label>
                <button
                    id="sound-toggle"
                    onClick={onToggleSound}
                    className="p-2 rounded-full text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    aria-label={isSoundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
                >
                    {isSoundEnabled ? <SoundOnIcon /> : <SoundOffIcon />}
                </button>
            </div>
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
