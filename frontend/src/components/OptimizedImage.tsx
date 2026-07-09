import { getCloudinaryUrl, getSrcSet, getBlurPlaceholder } from '@/services/cloudinary';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number | 'auto';
  format?: 'auto' | 'webp' | 'avif';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  gravity?: 'auto' | 'center' | 'face';
  widths?: number[];
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  blurPlaceholder?: boolean;
  onLoad?: () => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
}

export const OptimizedImage = ({
  src,
  alt,
  width = 800,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 'auto',
  format = 'auto',
  crop = 'fill',
  gravity = 'auto',
  widths = [400, 600, 800, 1200],
  loading,
  decoding,
  blurPlaceholder = false,
  onLoad,
  onError,
  onClick,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blurSrc, setBlurSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (blurPlaceholder && src) {
      setBlurSrc(getBlurPlaceholder(src));
    }
  }, [src, blurPlaceholder]);

  const optimizedSrc = getCloudinaryUrl(src, width, height, quality, {
    format,
    crop,
    gravity,
  });

  // ✅ FIX 1 : options (format/crop/gravity) transmises à getSrcSet, pour que
  // chaque entrée du srcset utilise le même crop que l'image affichée.
  // ✅ FIX 2 : pas de srcset généré s'il n'y a qu'une seule largeur (vignettes).
  const srcSet =
    widths.length > 1
      ? getSrcSet(src, widths, height, quality, { format, crop, gravity })
      : undefined;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={`${className} ${blurPlaceholder && !isLoaded ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-300`}
      width={width}
      height={height}
      loading={loading || (priority ? 'eager' : 'lazy')}
      decoding={decoding || (priority ? 'sync' : 'async')}
      fetchPriority={priority ? 'high' : 'auto'}
      onLoad={handleLoad}
      onError={onError}
      onClick={onClick}
      style={blurPlaceholder && !isLoaded ? { backgroundImage: `url(${blurSrc})` } : undefined}
    />
  );
};

// Version simplifiée pour PriorityImage
export const PriorityImage = (
  props: Omit<OptimizedImageProps, 'priority' | 'loading' | 'decoding'>
) => (
  <OptimizedImage {...props} loading="eager" decoding="sync" priority={true} />
);

// Version simplifiée pour LazyImage
export const LazyImage = (
  props: Omit<OptimizedImageProps, 'priority' | 'loading' | 'decoding'>
) => (
  <OptimizedImage {...props} loading="lazy" decoding="async" priority={false} />
);