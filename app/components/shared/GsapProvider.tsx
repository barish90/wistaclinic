'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { loadGsap } from '@/app/utils/loadGsap';

export interface GsapContextValue {
  gsapReady: boolean;
}

export const GsapContext = createContext<GsapContextValue>({ gsapReady: false });

interface GsapProviderProps {
  children: ReactNode;
}

const SCROLL_KEY = 'wista_scroll_y';

export function GsapProvider({ children }: GsapProviderProps) {
  const [gsapReady, setGsapReady] = useState(false);

  // Manually save scroll position on beforeunload so we can
  // restore it after GSAP + ScrollTrigger have fully initialised.
  useEffect(() => {
    // Disable the browser's built-in restoration — it fires too
    // early (before GSAP has set up pinned/sticky sections, so
    // the page height is wrong and the position is off).
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const save = () => {
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
      } catch { /* quota or private mode */ }
    };

    window.addEventListener('beforeunload', save);
    return () => window.removeEventListener('beforeunload', save);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let fontTimeoutId: ReturnType<typeof setTimeout> | undefined;

    // Wait for both GSAP and fonts to be ready.
    // SplitText needs accurate font metrics for correct text splitting.
    // Race document.fonts.ready against a 5s timeout to avoid hanging.
    const fontTimeout = new Promise<void>((resolve) => {
      fontTimeoutId = setTimeout(resolve, 5000);
      document.fonts.ready.then(() => {
        clearTimeout(fontTimeoutId);
        resolve();
      });
    });

    Promise.all([loadGsap(), fontTimeout])
      .then(() => {
        if (!cancelled) {
          setGsapReady(true);
          // After GSAP loads, components will create ScrollTrigger instances
          // in their own useEffects (triggered by gsapReady changing).
          // We need to refresh AFTER those run, then restore scroll.
          // Double rAF ensures React has committed and ST instances exist.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const ST = window.ScrollTrigger;
              if (ST) ST.refresh();

              // Now restore the saved scroll position
              try {
                const saved = sessionStorage.getItem(SCROLL_KEY);
                if (saved) {
                  const y = parseInt(saved, 10);
                  if (!isNaN(y) && y > 0) {
                    window.scrollTo(0, y);
                    // Refresh again so ST recalculates for the new position
                    requestAnimationFrame(() => {
                      if (ST) ST.refresh();
                    });
                  }
                  sessionStorage.removeItem(SCROLL_KEY);
                }
              } catch { /* private mode */ }
            });
          });
        }
      })
      .catch((error) => {
        console.error('Failed to load GSAP:', error);
        if (!cancelled) setGsapReady(false);
      });

    return () => {
      clearTimeout(fontTimeoutId);
      cancelled = true;
    };
  }, []);

  return (
    <GsapContext.Provider value={{ gsapReady }}>
      {children}
    </GsapContext.Provider>
  );
}
