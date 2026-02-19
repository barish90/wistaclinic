'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useGsap } from '@/app/hooks/useGsap';
import { cn } from '@/lib/utils';

type AnimationType = 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight';

interface AnimatedSectionProps {
  animation?: AnimationType;
  delay?: number;
  className?: string;
  children: ReactNode;
}

const animationConfigs: Record<AnimationType, {
  from: Record<string, number>;
  to: Record<string, number>;
}> = {
  fadeUp: {
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideLeft: {
    from: { opacity: 0, x: 100 },
    to: { opacity: 1, x: 0 },
  },
  slideRight: {
    from: { opacity: 0, x: -100 },
    to: { opacity: 1, x: 0 },
  },
};

export function AnimatedSection({
  animation = 'fadeUp',
  delay = 0,
  className,
  children,
}: AnimatedSectionProps) {
  const { gsapReady } = useGsap();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gsapReady || !elementRef.current) return;

    // Check for reduced motion preference — ensure element is visible
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (elementRef.current) {
        elementRef.current.style.opacity = '1';
      }
      return;
    }

    const element = elementRef.current;
    const config = animationConfigs[animation];

    // Ensure GSAP and ScrollTrigger are available on window
    if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap;

      // Set initial state
      gsap.set(element, config.from);

      // Create scroll-triggered animation and capture the tween
      const tween = gsap.to(element, {
        ...config.to,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Store the ScrollTrigger instance for cleanup
      const st = tween.scrollTrigger;

      // Cleanup function
      return () => {
        st?.kill();
      };
    } else {
      // GSAP/ScrollTrigger not available — make element visible anyway
      element.style.opacity = '1';
    }
  }, [gsapReady, animation, delay]);

  return (
    <div ref={elementRef} className={cn(className)}>
      {children}
    </div>
  );
}
