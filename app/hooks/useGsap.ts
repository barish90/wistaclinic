import { useContext } from 'react';
import { GsapContext, type GsapContextValue } from '@/app/components/shared/GsapProvider';

/**
 * Hook to access GSAP loading state from the nearest GsapProvider.
 * Must be used within a GsapProvider.
 * @returns `{ gsapReady: boolean }`
 */
export function useGsap(): GsapContextValue {
  const context = useContext(GsapContext);

  if (context === undefined) {
    throw new Error('useGsap must be used within a GsapProvider');
  }

  return context;
}
