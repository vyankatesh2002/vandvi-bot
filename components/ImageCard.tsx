
import React, { useState } from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ImageCardProps {
  base64: string;
  prompt: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ base64, prompt }) => {
  const [copied, setCopied] = useState(false);
  const imageUrl = `data:image/png;base64,${base64}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${prompt.slice(0, 30).replace(/\s/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg">
      <img src={imageUrl} alt={prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <p className="text-white text-sm line-clamp-3 mb-3">{prompt}</p>
        <div className="flex items-center gap-2">
          <button onClick={handleDownload} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors" aria-label="Download image">
            <DownloadIcon />
          </button>
          <button onClick={handleCopy} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors" aria-label="Copy prompt">
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};
