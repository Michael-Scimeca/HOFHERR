'use client';

import { useEffect, useRef } from 'react';

interface Props {
  src: string;
  type: 'video' | 'image';
  alt?: string;
  className?: string;
  /** Parallax travel range as % of image height. Default 30 = ±15%. */
  strength?: number;
}

export default function ParallaxMedia({
  src,
  type,
  alt = '',
  className,
  strength = 30,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The parent element (e.g. .cardImg) is the overflow:hidden mask / bounding box
    const container = el.parentElement;
    if (!container) return;

    let rafId: number;

    const update = () => {
      if (window.innerWidth <= 1024) {
        el.style.transform = 'none';
        return;
      }
      const rect = container.getBoundingClientRect();
      const vh   = window.innerHeight;

      // 0 = element bottom enters viewport, 1 = element top exits viewport
      const raw      = 1 - rect.bottom / (vh + rect.height);
      const progress = Math.max(0, Math.min(1, raw));

      // Map 0→1 to -strength/2 → +strength/2  (%)
      const shift = (progress - 0.5) * strength;
      el.style.transform = `translateY(${shift}%)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // set initial position

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [strength]);

  if (type === 'video') {
    return (
      <video
        ref={ref as React.RefObject<HTMLVideoElement>}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className={className}
      />
    );
  }

  return (
    <img
      ref={ref as React.RefObject<HTMLImageElement>}
      src={src}
      alt={alt}
      className={className}
    />
  );
}
