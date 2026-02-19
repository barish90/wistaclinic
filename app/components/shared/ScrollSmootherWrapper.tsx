'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useGsap } from '@/app/hooks/useGsap';

interface ScrollSmootherWrapperProps {
  children: ReactNode;
}

export function ScrollSmootherWrapper({ children }: ScrollSmootherWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { gsapReady } = useGsap();

  useEffect(() => {
    if (!gsapReady || !wrapperRef.current || !contentRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ScrollSmoother = (window as any).ScrollSmoother;
    if (!ScrollSmoother) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    return () => {
      if (smoother && typeof smoother.kill === 'function') {
        smoother.kill();
      }
    };
  }, [gsapReady]);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
