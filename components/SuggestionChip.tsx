import React from 'react';

interface SuggestionChipProps {
  text: string;
  onClick: (text: string) => void;
  disabled?: boolean;
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={() => onClick(text)}
      disabled={disabled}
      className="px-4 py-2 whitespace-nowrap bg-transparent text-zinc-300 text-sm font-medium rounded-full border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {text}
    </button>
  );
};