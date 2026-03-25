'use client';

import { useEffect, useRef } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
  /** Parallax travel range as a % of the image's extra height. Default 30 (= ±15%) */
  strength?: number;
}

export default function ParallaxImg({ src, alt, className, strength = 30 }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // The containing <li> is our mask / bounding box
    const container = img.parentElement as HTMLElement | null;
    if (!container) return;

    let rafId: number;

    const update = () => {
      const rect = container.getBoundingClientRect();
      const vh   = window.innerHeight;

      // progress: 0 = bottom of element enters viewport, 1 = top leaves viewport
      const raw      = 1 - rect.bottom / (vh + rect.height);
      const progress = Math.max(0, Math.min(1, raw));

      // Map 0→1 to -strength/2 → +strength/2 (%)
      const shift = (progress - 0.5) * strength;
      img.style.transform = `translateY(${shift}%)`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // set initial position without waiting for scroll

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [strength]);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
    />
  );
}
