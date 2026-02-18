'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface CTADict {
  home?: {
    cta?: {
      title?: string;
      subtitle?: string;
      button?: string;
      trust?: string[];
    };
  };
}

interface BookingCTAProps {
  locale: string;
  dict: CTADict;
}

export default function BookingCTA({ locale, dict }: BookingCTAProps) {
  const { gsapReady } = useGsap();
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<SVGPathElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const trustItemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gsapReady || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const DrawSVGPlugin = window.DrawSVGPlugin;

    if (!gsap || !ScrollTrigger || !SplitText || !DrawSVGPlugin) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // 1. Draw ornamental frame
      if (frameRef.current) {
        gsap.set(frameRef.current, { drawSVG: '0%' });
        timeline.to(frameRef.current, {
          drawSVG: '100%',
          duration: 1.5,
          ease: 'power3.inOut',
        }, 0);
      }

      // 2. Split text title animation
      let splitInstance: { revert: () => void } | null = null;
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'chars' });
        splitInstance = split;
        gsap.set(split.chars, { yPercent: 100, opacity: 0 });
        timeline.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.02,
          duration: 0.6,
          ease: 'power3.out',
        }, 0.3);
      }

      // 3. Subtitle fade up
      if (subtitleRef.current) {
        timeline.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.6
        );
      }

      // 4. Button scale with bounce
      if (buttonRef.current) {
        timeline.fromTo(
          buttonRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
          0.9
        );
      }

      // 5. Trust items fade stagger
      if (trustItemsRef.current) {
        const items = trustItemsRef.current.querySelectorAll('.trust-item');
        timeline.fromTo(
          items,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
          1.1
        );
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
    // Note: splitInstance is reverted by ctx.revert() since it's created within gsap.context
  }, [gsapReady]);

  const trustItems = dict.home?.cta?.trust || [
    'Free Consultation',
    'No Hidden Fees',
    'Lifetime Follow-up',
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A1610 0%, #2A2015 50%, #1A1610 100%)',
      }}
    >
      {/* Bronze radial glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(184,134,11,0.15) 0%, transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Ornamental Frame SVG */}
          <svg
            className="mx-auto mb-8"
            width="80%"
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <style>{`
                .frame-path {
                  stroke: #B8860B;
                  stroke-width: 1.5;
                  fill: none;
                }
              `}</style>
            </defs>

            {/* Main rectangular frame with rounded corners */}
            <path
              ref={frameRef}
              className="frame-path"
              d="M 100 50
                 L 700 50
                 Q 750 50 750 100
                 L 750 300
                 Q 750 350 700 350
                 L 100 350
                 Q 50 350 50 300
                 L 50 100
                 Q 50 50 100 50 Z

                 M 80 80 L 50 80 L 50 50 L 80 50
                 M 720 50 L 750 50 L 750 80 L 750 50
                 M 750 320 L 750 350 L 720 350
                 M 80 350 L 50 350 L 50 320"
            />

            {/* Decorative corner flourishes */}
            <path
              className="frame-path"
              d="M 70 70 L 70 90 M 70 70 L 90 70
                 M 730 70 L 730 90 M 730 70 L 710 70
                 M 70 330 L 70 310 M 70 330 L 90 330
                 M 730 330 L 730 310 M 730 330 L 710 330"
              strokeLinecap="round"
            />
          </svg>

          {/* Content inside frame */}
          <div className="px-6">
            <h2
              ref={titleRef}
              className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-tight mb-6"
              style={{ color: '#D4AF37' }}
            >
              {dict.home?.cta?.title || 'Begin Your Transformation Today'}
            </h2>

            <p
              ref={subtitleRef}
              className="font-sans text-xl max-w-xl mx-auto mb-10"
              style={{ color: '#F7E7CE' }}
            >
              {dict.home?.cta?.subtitle || 'Schedule your free consultation and discover personalized treatments designed exclusively for you.'}
            </p>

            {/* CTA Button with shimmer effect */}
            <Link
              ref={buttonRef}
              href={`/${locale}/contact`}
              className="shimmer-btn relative inline-flex items-center gap-3 px-10 py-4 text-lg font-semibold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #B8860B 0%, #D4A847 100%)',
                color: '#FAF7F2',
              }}
            >
              <span className="relative z-10">
                {dict.home?.cta?.button || 'Book Free Consultation'}
              </span>
              <ArrowRight className="w-5 h-5 relative z-10" />
            </Link>

            {/* Trust items */}
            <div
              ref={trustItemsRef}
              className="flex flex-wrap justify-center gap-6 mt-12"
            >
              {trustItems.map((item: string, index: number) => (
                <div
                  key={index}
                  className="trust-item flex items-center gap-2"
                >
                  <Check className="w-5 h-5" style={{ color: '#B8860B' }} />
                  <span className="text-sm font-medium" style={{ color: '#B8B0A4' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer effect styles */}
      <style jsx>{`
        .shimmer-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .shimmer-btn:hover::after {
          left: 100%;
        }
      `}</style>
    </section>
  );
}
