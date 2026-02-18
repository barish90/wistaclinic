'use client';

import { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useGsap } from '@/app/hooks/useGsap';
import { galleryItems } from '@/lib/data/gallery';

interface ResultsShowcaseProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function ResultsShowcase({ locale, dict }: ResultsShowcaseProps) {
  const { gsapReady } = useGsap();
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Take first 3 gallery items for featured display
  const featuredItems = galleryItems.slice(0, 3);

  // Parse stat values for animation
  const stats = useMemo(() => [
    {
      value: 12000,
      display: '12,000+',
      label: dict.home.results.stats.proceduresLabel,
    },
    {
      value: 45,
      display: '45+',
      label: dict.home.results.stats.countriesLabel,
    },
    {
      value: 98,
      display: '98%',
      label: dict.home.results.stats.satisfactionLabel,
    },
  ], [dict.home.results.stats]);

  useEffect(() => {
    if (!gsapReady || !wrapperRef.current || !titleRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;

    if (!gsap || !ScrollTrigger || !SplitText) return;

    const ctx = gsap.context(() => {
      // 1. Background color morph from white to dark
      gsap.to(wrapperRef.current, {
        backgroundColor: '#0F0E0C',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      });

      // 2. Title character cascade animation
      const split = new SplitText(titleRef.current, { type: 'chars' });
      gsap.set(split.chars, { color: '#555555' });

      gsap.to(split.chars, {
        color: '#FAF7F2',
        stagger: 0.02,
        duration: 0.8,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: true,
        },
      });

      // 3. Counter animations
      if (statsRef.current) {
        const counterElements = statsRef.current.querySelectorAll('[data-counter]');
        counterElements.forEach((el, index) => {
          const target = stats[index].value;
          const display = stats[index].display;
          const obj = { val: 0 };

          gsap.to(obj, {
            val: target,
            duration: 2,
            snap: { val: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 70%',
            },
            onUpdate: () => {
              if (display.includes('%')) {
                el.textContent = `${Math.round(obj.val)}%`;
              } else if (display.includes('+')) {
                el.textContent = `${Math.round(obj.val).toLocaleString()}+`;
              } else {
                el.textContent = Math.round(obj.val).toLocaleString();
              }
            },
          });
        });
      }

      // 4. Card animations - different directions
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('[data-card]');
        const directions = [
          { x: -100, opacity: 0 },
          { y: 100, opacity: 0 },
          { x: 100, opacity: 0 },
        ];

        cards.forEach((card, index) => {
          if (index < directions.length) {
            gsap.from(card, {
              ...directions[index],
              duration: 0.8,
              scrollTrigger: {
                trigger: card,
                start: 'top 80%',
              },
            });
          }
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [gsapReady, stats]);

  return (
    <div ref={wrapperRef} className="bg-white transition-colors duration-300">
      <section ref={sectionRef} className="py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title & Subtitle */}
          <div className="text-center mb-16">
            <h2
              ref={titleRef}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FAF7F2] mb-6"
            >
              {dict.home.results.title}
            </h2>
            <p className="font-sans text-lg sm:text-xl text-[#FAF7F2]/70 max-w-2xl mx-auto">
              {dict.home.results.subtitle}
            </p>
          </div>

          {/* Stats Row */}
          <div
            ref={statsRef}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center gap-4">
                  {index > 0 && (
                    <div className="hidden sm:block w-px h-16 bg-[#FAF7F2]/20" />
                  )}
                  <div>
                    <div
                      data-counter
                      className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#D4AF37] mb-2"
                    >
                      {stat.display}
                    </div>
                    <div className="font-sans text-sm sm:text-base text-[#FAF7F2]/60 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured Before/After Cards */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {featuredItems.map((item) => (
              <div key={item.id} data-card className="group">
                {/* Split Before/After Card */}
                <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden border border-[#3A3937] mb-4">
                  {/* Before Side */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: item.beforeGradient,
                      clipPath: 'polygon(0 0, 50% 0, 45% 100%, 0 100%)',
                    }}
                  >
                    <div className="absolute top-4 left-4">
                      <span className="font-sans text-xs uppercase tracking-wider text-white text-shadow-lg">
                        Before
                      </span>
                    </div>
                  </div>

                  {/* After Side */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: item.afterGradient,
                      clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 50% 100%)',
                    }}
                  >
                    <div className="absolute top-4 right-4">
                      <span className="font-sans text-xs uppercase tracking-wider text-white text-shadow-lg">
                        After
                      </span>
                    </div>
                  </div>

                  {/* Diagonal Divider Line */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="50%"
                      y1="0"
                      x2="47.5%"
                      y2="100%"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                {/* Card Info */}
                <div className="text-center">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#FAF7F2] mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-[#FAF7F2]/60 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link
              href={`/${locale}/gallery`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] hover:bg-[#C4A137] text-[#0F0E0C] font-sans font-semibold rounded-full transition-colors duration-300"
            >
              {dict.home.results.viewGallery}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
