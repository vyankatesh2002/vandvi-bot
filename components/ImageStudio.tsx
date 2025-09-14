

import React, { useState, useRef } from 'react';
import type { GoogleGenAI } from '@google/genai';
import { ImageCard } from './ImageCard';
import { ImageLoadingSkeleton } from './ImageLoadingSkeleton';
import { WandIcon } from './icons/WandIcon';

type AspectRatio = '1:1' | '16:9' | '9:16';
type ArtisticStyle = 'photorealistic' | 'anime' | 'cartoon' | 'fantasy';

interface GeneratedImage {
  base64: string;
  prompt: string;
}

interface ImageStudioProps {
  genAi: GoogleGenAI | null;
}

const reassuringMessages = [
    "Crafting your vision, pixel by pixel...",
    "The digital canvas is taking shape...",
    "Summoning creativity from the cloud...",
    "This might take a moment, great art needs patience!",
    "Polishing the pixels..."
];

const aspectRatioTooltips: Record<AspectRatio, string> = {
    '1:1': 'Square (1:1) - Perfect for profile pictures and posts.',
    '16:9': 'Widescreen (16:9) - Ideal for landscapes and cinematic shots.',
    '9:16': 'Portrait (9:16) - Great for mobile wallpapers and stories.',
};

const artisticStyles: ArtisticStyle[] = ['photorealistic', 'anime', 'cartoon', 'fantasy'];

export const ImageStudio: React.FC<ImageStudioProps> = ({ genAi }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState<ArtisticStyle>('photorealistic');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reassuringMessage, setReassuringMessage] = useState(reassuringMessages[0]);

  const intervalRef = useRef<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || !genAi) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]); // Clear previous images

    intervalRef.current = window.setInterval(() => {
        setReassuringMessage(reassuringMessages[Math.floor(Math.random() * reassuringMessages.length)]);
    }, 2500);
    
    // Construct the final prompt
    let finalPrompt = `${prompt}, ${style} style`;
    if (negativePrompt.trim()) {
        finalPrompt += `, avoid the following: ${negativePrompt}`;
    }

    try {
      const response = await genAi.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: finalPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const newImage: GeneratedImage = {
          base64: response.generatedImages[0].image.imageBytes,
          prompt: prompt, // Keep original prompt for the card
        };
        setGeneratedImages([newImage]);
      } else {
        setError("Couldn't generate an image. The prompt may have been rejected.");
      }

    } catch (e) {
      console.error("Image generation failed:", e);
      setError("An error occurred during image generation. Please try again.");
    } finally {
      setIsGenerating(false);
      if(intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return (
    <div className="flex h-full bg-zinc-900/50">
      {/* CONTROLS PANEL */}
      <div className="w-full max-w-sm flex-shrink-0 bg-zinc-900 p-6 pt-20 flex flex-col space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold text-white">Image Studio</h1>
          <p className="text-zinc-400 text-sm mt-1">Bring your ideas to life with generative imagery.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="prompt-input" className="block text-sm font-medium text-zinc-300">
            Prompt
          </label>
          <textarea
            id="prompt-input"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A cinematic shot of a raccoon astronaut on a planet made of cheese"
            disabled={isGenerating}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="negative-prompt-input" className="block text-sm font-medium text-zinc-300">
            Negative Prompt <span className="text-zinc-500">(optional)</span>
          </label>
          <textarea
            id="negative-prompt-input"
            rows={2}
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="e.g., text, watermarks, blurry"
            disabled={isGenerating}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
                Artistic Style
            </label>
            <div className="grid grid-cols-2 gap-2">
                {artisticStyles.map(s => (
                    <button 
                        key={s}
                        onClick={() => setStyle(s)}
                        disabled={isGenerating}
                        className={`py-2 px-3 text-sm rounded-md transition-colors capitalize disabled:opacity-50 ${style === s ? 'bg-cyan-500 text-white font-semibold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
                Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-2">
                {(['1:1', '16:9', '9:16'] as AspectRatio[]).map(ar => (
                    <button 
                        key={ar}
                        onClick={() => setAspectRatio(ar)}
                        disabled={isGenerating}
                        title={aspectRatioTooltips[ar]}
                        className={`py-2 px-3 text-sm rounded-md transition-colors disabled:opacity-50 ${aspectRatio === ar ? 'bg-cyan-500 text-white font-semibold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                    >
                        {ar}
                    </button>
                ))}
            </div>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <WandIcon />
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* GALLERY */}
      <div className="flex-1 p-6 pt-20 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-full max-w-md">
                        <ImageLoadingSkeleton aspectRatio={aspectRatio} />
                    </div>
                    <p className="mt-4 text-zinc-300 animate-pulse">{reassuringMessage}</p>
                </div>
            ) : generatedImages.length > 0 ? (
                <div className={`w-full max-w-md mx-auto ${aspectRatio === '9:16' ? 'max-w-xs' : ''}`}>
                    {generatedImages.map((img, index) => (
                        <ImageCard key={index} base64={img.base64} prompt={img.prompt} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 p-10 border-2 border-dashed border-zinc-800 rounded-lg">
                    <WandIcon className="w-16 h-16 mb-4" />
                    <h2 className="text-xl font-semibold text-zinc-300">Your canvas awaits</h2>
                    <p>Describe what you want to create in the prompt panel and click 'Generate'.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
