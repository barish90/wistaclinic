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

export function GsapProvider({ children }: GsapProviderProps) {
  const [gsapReady, setGsapReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Wait for both GSAP and fonts to be ready.
    // SplitText needs accurate font metrics for correct text splitting.
    // Race document.fonts.ready against a 5s timeout to avoid hanging.
    const fontTimeout = new Promise<void>((resolve) => {
      const id = setTimeout(resolve, 5000);
      document.fonts.ready.then(() => {
        clearTimeout(id);
        resolve();
      });
    });

    Promise.all([loadGsap(), fontTimeout])
      .then(() => {
        if (!cancelled) setGsapReady(true);
      })
      .catch((error) => {
        console.error('Failed to load GSAP:', error);
        if (!cancelled) setGsapReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GsapContext.Provider value={{ gsapReady }}>
      {children}
    </GsapContext.Provider>
  );
}
