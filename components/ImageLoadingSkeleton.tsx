
import React from 'react';

interface ImageLoadingSkeletonProps {
  aspectRatio?: '1:1' | '16:9' | '9:16';
}

export const ImageLoadingSkeleton: React.FC<ImageLoadingSkeletonProps> = ({ aspectRatio = '1:1' }) => {
  const aspectRatioClass = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
  }[aspectRatio];

  return (
    <div className={`relative w-full ${aspectRatioClass} bg-zinc-800 rounded-lg overflow-hidden animate-pulse`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
