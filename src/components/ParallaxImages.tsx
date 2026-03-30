'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ParallaxImages
 *
 * Finds every element with [data-parallax] in the DOM and applies a
 * scroll-driven parallax effect:
 *
 *  – Wrap mode (default, data-parallax="wrap"):
 *      The image is wrapped in a .parallax-mask container that clips it.
 *      The image height is stretched to 130% so there's room to travel.
 *      On scroll, translateY() is applied based on the container's
 *      position inside the viewport.
 *
 *  – Inset mode (data-parallax="inset"):
 *      Used for images that already live inside a clipping container
 *      (e.g. Next.js <Image fill> inside a positioned div).
 *      Only translateY() is applied — no DOM restructuring.
 *
 * Adding / removing the effect is 100% in this file.
 * To opt an image in, add:  data-parallax="wrap" or data-parallax="inset"
 */

const PARALLAX_SPEED = 0.25; // fraction of container height; tweak freely

interface ParallaxEntry {
  mask: Element;       // the overflow:hidden container we measure
  img: HTMLElement;    // the element we translate
}

export default function ParallaxImages() {
  const pathname = usePathname();

  useEffect(() => {
    let entries: ParallaxEntry[] = [];
    let rafId: number | null = null;
    let ticking = false;

    // ── 1. Function to find and initialize new targets ────────────────────────
    function initTargets() {
      const targets = document.querySelectorAll<HTMLElement>('[data-parallax]:not([data-parallax-init])');
      
      targets.forEach((el) => {
        const mode = el.getAttribute('data-parallax');
        el.setAttribute('data-parallax-init', 'true'); // Mark as initialized

        if (mode === 'wrap') {
          const mask = document.createElement('div');
          mask.className = 'parallax-mask';
          const parent = el.parentElement!;
          parent.insertBefore(mask, el);
          mask.appendChild(el);
          el.classList.add('parallax-img');
          entries.push({ mask, img: el });
        } else if (mode === 'inset') {
          const mask = el.parentElement!;
          el.style.top = '-15%';
          el.style.bottom = 'unset';
          el.style.height = '130%';
          el.style.willChange = 'transform';
          entries.push({ mask, img: el });
        }
      });
    }

    // ── 2. Tick: calculate & apply transforms ──────────────────────────────
    function tick() {
      ticking = false;
      const vh = window.innerHeight;

      // Filter out entries whose elements have been removed from DOM
      entries = entries.filter(e => document.body.contains(e.mask));

      entries.forEach(({ mask, img }) => {
        const rect = mask.getBoundingClientRect();
        const progress = 1 - (rect.bottom / (rect.height + vh));
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const shift = (clampedProgress - 0.5) * 2 * PARALLAX_SPEED * rect.height;
        (img as HTMLElement).style.transform = `translateY(${shift.toFixed(2)}px)`;
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        rafId = requestAnimationFrame(tick);
      }
    }

    // ── 3. Mutation Observer to catch dynamic remounts ──────────────────────
    const observer = new MutationObserver(() => {
      initTargets();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Initial run
    initTargets();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
    // Also hook into Lenis if available (fires on virtual scroll)
    type LenisInstance = { on: (event: string, cb: () => void) => void; off: (event: string, cb: () => void) => void };
    const lenis = (window as unknown as { lenis?: LenisInstance }).lenis;
    if (lenis) {
      lenis.on('scroll', onScroll);
    }

    tick();

    // ── 4. Cleanup ─────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (lenis) lenis.off('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);

      // Un-wrap wrap-mode images
      entries.forEach(({ mask, img }) => {
        if (img.getAttribute('data-parallax') === 'wrap') {
          img.classList.remove('parallax-img');
          img.style.transform = '';
          img.style.willChange = '';
          const parent = mask.parentElement;
          if (parent) {
            parent.insertBefore(img, mask);
            mask.remove();
          }
        } else {
          img.style.transform = '';
          img.style.willChange = '';
          img.style.top = '';
          img.style.bottom = '';
          img.style.height = '';
        }
        img.removeAttribute('data-parallax-init');
      });
      observer.disconnect();
    };
  }, [pathname]); // Re-run whenever the page changes (Next.js SPA navigation)

  return null;
}
