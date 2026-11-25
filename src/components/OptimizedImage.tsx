import React, { useState, useEffect, useRef } from 'react';
import { Building2 } from 'lucide-react';
import { resolveImageAsset, BUNDLED_DEFAULT_COURT } from '../utils/imageAssets';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatioClassName?: string; // e.g. 'aspect-[16/10]', 'aspect-[4/3]', 'aspect-square'
  priority?: boolean; // For LCP (Hero) images
  fallbackText?: string;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatioClassName = '',
  priority = false,
  fallbackText,
  fallbackSrc = BUNDLED_DEFAULT_COURT,
  onError,
  onLoad,
  referrerPolicy = 'no-referrer',
  ...restProps
}) => {
  const resolvedFallback = resolveImageAsset(fallbackSrc, BUNDLED_DEFAULT_COURT);
  const resolvedPrimary = resolveImageAsset(src, resolvedFallback);

  const [currentSrc, setCurrentSrc] = useState<string>(resolvedPrimary);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(resolvedPrimary);
    setHasTriedFallback(false);
    setIsError(false);
  }, [resolvedPrimary]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    setIsError(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasTriedFallback && resolvedFallback && currentSrc !== resolvedFallback) {
      setHasTriedFallback(true);
      setCurrentSrc(resolvedFallback);
      return;
    }
    if (currentSrc !== BUNDLED_DEFAULT_COURT) {
      setHasTriedFallback(true);
      setCurrentSrc(BUNDLED_DEFAULT_COURT);
      return;
    }
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
      {/* Background Shimmer placeholder until image loads - pointer-events-none and z-0 */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-slate-200/60 animate-pulse pointer-events-none z-0 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-slate-400/60" />
        </div>
      )}

      {/* Fallback Display only if even bundled court image fails */}
      {isError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-[#000f22] flex flex-col items-center justify-center p-4 text-center text-slate-300 z-10">
          <Building2 className="w-8 h-8 mb-2 text-[#ffb3b1]" />
          <span className="text-xs font-semibold max-w-[80%] line-clamp-2">
            {fallbackText || alt || 'Caih Group Property'}
          </span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          referrerPolicy={referrerPolicy}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-300 relative z-[1] ${
            isLoaded ? 'opacity-100' : 'opacity-90'
          } ${className}`}
          {...restProps}
        />
      )}
    </div>
  );
};
