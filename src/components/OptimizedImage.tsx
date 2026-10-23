import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClassName?: string; // e.g. 'aspect-[16/9]', 'aspect-[4/3]', 'aspect-square'
  priority?: boolean; // For LCP (Hero) images
  fallbackText?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatioClassName = '',
  priority = false,
  fallbackText,
  onError,
  onLoad,
  ...restProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsError(true);
    setIsLoaded(true);
    if (onError) {
      onError(e);
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-slate-100 ${aspectRatioClassName} ${containerClassName}`}
    >
      {/* Skeleton Pulse / Shimmer placeholder until image loads */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-0 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-300 opacity-50" />
        </div>
      )}

      {/* Fallback Display if Image Fails to Load */}
      {isError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-[#000f22] flex flex-col items-center justify-center p-4 text-center text-slate-300 z-10">
          <Building2 className="w-8 h-8 mb-2 text-[#ffb3b1]/80" />
          <span className="text-xs font-semibold max-w-[80%] line-clamp-2">
            {fallbackText || alt || 'Property Image'}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...restProps}
        />
      )}
    </div>
  );
};
