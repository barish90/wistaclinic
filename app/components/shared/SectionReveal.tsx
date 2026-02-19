'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useGsap } from '@/app/hooks/useGsap';

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
}

/**
 * Simple, clean scroll-triggered entrance for each section.
 * Content fades up into view as it enters the viewport.
 * Uses once:true so it plays once and gets out of the way.
 */
export function SectionReveal({ children, className }: SectionRevealProps) {
  const { gsapReady } = useGsap();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gsapReady || !ref.current) return;

    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const el = ref.current;

    gsap.set(el, { opacity: 0, y: 80 });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: 'opacity,y' });
    };
  }, [gsapReady]);

  // Fallback: if GSAP never loads, show content after a delay
  useEffect(() => {
    if (gsapReady) return; // GSAP will handle visibility
    const fallbackTimer = setTimeout(() => {
      if (ref.current) {
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'none';
      }
    }, 3000);
    return () => clearTimeout(fallbackTimer);
  }, [gsapReady]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0, transform: 'translateY(80px)' }}>
      {children}
    </div>
  );
}
