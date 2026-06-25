// src/components/LazyImageObserver.tsx
import { useInView } from 'react-intersection-observer';
import { OptimizedImage, OptimizedImageProps } from './OptimizedImage';

export const LazyImageObserver = (props: Omit<OptimizedImageProps, 'loading'>) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  return (
    <div ref={ref}>
      {inView ? (
        <OptimizedImage {...props} loading="lazy" />
      ) : (
        <div className={`${props.className} bg-gray-100 animate-pulse`} style={{ width: props.width, height: props.height }} />
      )}
    </div>
  );
};