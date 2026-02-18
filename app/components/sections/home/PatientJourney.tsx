'use client';

import { useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  ClipboardList,
  Plane,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface PatientJourneyProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

const ICONS = [MessageCircle, ClipboardList, Plane, Stethoscope, HeartPulse];

export default function PatientJourney({ dict }: PatientJourneyProps) {
  const { gsapReady } = useGsap();
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const svgPathDesktopRef = useRef<SVGPathElement>(null);
  const svgPathMobileRef = useRef<SVGPathElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  // Detect mobile on mount and resize (throttled)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();

    let rafId: number | null = null;
    const throttledCheck = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        checkMobile();
        rafId = null;
      });
    };

    window.addEventListener('resize', throttledCheck);
    return () => {
      window.removeEventListener('resize', throttledCheck);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!gsapReady || !sectionRef.current) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const DrawSVGPlugin = window.DrawSVGPlugin;

    if (!gsap || !ScrollTrigger || !SplitText || !DrawSVGPlugin) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Split title text
      if (titleRef.current) {
        const split = new SplitText(titleRef.current, { type: 'lines' });
        gsap.set(split.lines, { opacity: 0, y: 30 });

        gsap.to(split.lines, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
          },
        });
      }

      // Fade in subtitle
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 80%',
          },
        });
      }

      // DrawSVG animation for paths (desktop and mobile)
      const activePath = window.innerWidth >= 1024 ? svgPathDesktopRef.current : svgPathMobileRef.current;
      if (activePath) {
        gsap.set(activePath, { drawSVG: '0%' });

        gsap.to(activePath, {
          drawSVG: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: 1,
          },
        });
      }

      // Animate each step
      circleRefs.current.forEach((circle, index) => {
        if (!circle) return;

        const icon = iconRefs.current[index];
        const title = titleRefs.current[index];
        const desc = descRefs.current[index];

        // Create timeline for this step
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: circle,
            start: 'top 70%',
            onEnter: () => {
              // Add pulse animation class
              circle.classList.add('pulse-ring');
            },
          },
        });

        // Circle scale in with elastic ease
        tl.from(circle, {
          scale: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
        });

        // Icon fade in
        if (icon) {
          tl.from(
            icon,
            {
              opacity: 0,
              duration: 0.4,
            },
            '-=0.4'
          );
        }

        // Title fade up
        if (title) {
          tl.from(
            title,
            {
              opacity: 0,
              y: 15,
              duration: 0.5,
            },
            '-=0.2'
          );
        }

        // Description fade up
        if (desc) {
          tl.from(
            desc,
            {
              opacity: 0,
              y: 15,
              duration: 0.5,
            },
            '-=0.3'
          );
        }
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [gsapReady, isMobile]);

  const steps = dict?.home?.journey?.steps || [];

  return (
    <>
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(184, 134, 11, 0.4);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(184, 134, 11, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(184, 134, 11, 0);
          }
        }

        :global(.pulse-ring) {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1);
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative py-24 lg:py-32 overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.05) 0%, #F5F3F0 50%)',
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <h2
              ref={titleRef}
              className="font-serif text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              {dict?.home?.journey?.title || 'Your Journey with Us'}
            </h2>
            <p
              ref={subtitleRef}
              className="font-sans text-lg text-gray-600 max-w-2xl mx-auto"
            >
              {dict?.home?.journey?.subtitle ||
                'From your first consultation to complete recovery, we guide you every step of the way'}
            </p>
          </div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Desktop Layout */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* SVG Connecting Line */}
                <svg
                  className="absolute top-7 left-0 w-full h-[2px]"
                  style={{ zIndex: 0 }}
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 2"
                >
                  <path
                    ref={svgPathDesktopRef}
                    d="M 0 1 L 1000 1"
                    stroke="#B8860B"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>

                {/* Steps */}
                <div className="relative flex justify-between items-start">
                  {steps.map((step: { title: string; description: string }, index: number) => {
                    const Icon = ICONS[index] || MessageCircle;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center w-1/5"
                        style={{ zIndex: 1 }}
                      >
                        {/* Circle */}
                        <div
                          ref={(el) => {
                            circleRefs.current[index] = el;
                          }}
                          className="w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center mb-6"
                          style={{ borderColor: '#B8860B' }}
                        >
                          <div
                            ref={(el) => {
                              iconRefs.current[index] = el;
                            }}
                          >
                            <Icon size={24} style={{ color: '#B8860B' }} />
                          </div>
                        </div>

                        {/* Content */}
                        <h3
                          ref={(el) => {
                            titleRefs.current[index] = el;
                          }}
                          className="font-serif text-base font-semibold text-gray-900 mb-2 text-center"
                        >
                          {step.title}
                        </h3>
                        <p
                          ref={(el) => {
                            descRefs.current[index] = el;
                          }}
                          className="font-sans text-sm text-gray-600 text-center leading-relaxed"
                        >
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="relative pl-12">
                {/* SVG Connecting Line */}
                <svg
                  className="absolute left-7 top-0 w-[2px]"
                  style={{ height: '100%', zIndex: 0 }}
                  preserveAspectRatio="none"
                  viewBox="0 0 2 1000"
                >
                  <path
                    ref={svgPathMobileRef}
                    d="M 1 0 L 1 1000"
                    stroke="#B8860B"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>

                {/* Steps */}
                <div className="relative space-y-12">
                  {steps.map((step: { title: string; description: string }, index: number) => {
                    const Icon = ICONS[index] || MessageCircle;
                    return (
                      <div key={index} className="relative flex items-start">
                        {/* Circle */}
                        <div
                          ref={(el) => {
                            circleRefs.current[index] = el;
                          }}
                          className="absolute -left-12 w-14 h-14 rounded-full bg-white border-2 flex items-center justify-center"
                          style={{ borderColor: '#B8860B', zIndex: 1 }}
                        >
                          <div
                            ref={(el) => {
                              iconRefs.current[index] = el;
                            }}
                          >
                            <Icon size={24} style={{ color: '#B8860B' }} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3
                            ref={(el) => {
                              titleRefs.current[index] = el;
                            }}
                            className="font-serif text-lg font-semibold text-gray-900 mb-2"
                          >
                            {step.title}
                          </h3>
                          <p
                            ref={(el) => {
                              descRefs.current[index] = el;
                            }}
                            className="font-sans text-sm text-gray-600 leading-relaxed"
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
