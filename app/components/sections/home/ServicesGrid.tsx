'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { procedures } from '@/lib/data/procedures';
import { useGsap } from '@/app/hooks/useGsap';

interface ServicesGridProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/*
  Bento grid layout config — controls the CSS grid area for each card.
  Desktop: 4-column grid with varied spans.
  Index 0 = featured hero card (2 col × 2 row).
*/
const gridAreas: Record<number, string> = {
  0: 'lg:col-span-2 lg:row-span-2',           // Rhinoplasty — hero panel
  1: 'lg:col-span-1 lg:row-span-1',           // Breast Aug
  2: 'lg:col-span-1 lg:row-span-1',           // BBL
  3: 'lg:col-span-1 lg:row-span-2',           // Liposuction — tall
  4: 'lg:col-span-1 lg:row-span-1',           // Hair Transplant
  5: 'lg:col-span-1 lg:row-span-1',           // Facial Aesthetics
  6: 'lg:col-span-1 lg:row-span-1',           // Body Contouring
};

/* Subtle warm-toned dark backgrounds for each card — avoiding monotone */
const cardTones: Record<number, string> = {
  0: '#1A1816',
  1: '#1C1917',
  2: '#1B1A17',
  3: '#191816',
  4: '#1D1A18',
  5: '#1A1917',
  6: '#1C1B18',
};

export default function ServicesGrid({ locale, dict }: ServicesGridProps) {
  const { gsapReady } = useGsap();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gsapReady || typeof window === 'undefined') return;
    if (!window.gsap || !window.ScrollTrigger) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      /* ── Header reveal ── */
      if (headerRef.current) {
        const els = headerRef.current.querySelectorAll('[data-reveal]');
        gsap.from(els, {
          opacity: 0,
          y: 50,
          stagger: 0.15,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }

      /* ── Cards stagger from varying distances ── */
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('[data-card]');
        cards.forEach((card, i) => {
          // Varying initial Y offsets for organic feel
          const yOffset = [80, 60, 100, 70, 90, 50, 75][i] || 70;
          gsap.from(card, {
            opacity: 0,
            y: yOffset,
            scale: 0.97,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
            delay: i * 0.06,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#FAF7F2' }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* ═══ HEADER ═══ */}
        <div ref={headerRef} className="pt-28 pb-16 lg:pt-36 lg:pb-24 text-center px-6">
          <p
            data-reveal
            className="uppercase mb-5"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(11px, 1.2vw, 14px)',
              fontWeight: 400,
              color: '#B8860B',
              letterSpacing: '0.35em',
            }}
          >
            {dict.home.services.subtitle}
          </p>
          <h2
            data-reveal
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(40px, 6.5vw, 76px)',
              fontWeight: 300,
              color: '#3D3830',
              letterSpacing: '0.05em',
              lineHeight: 1.1,
            }}
          >
            {dict.home.services.title}
          </h2>
          <div
            data-reveal
            className="mx-auto mt-8"
            style={{
              width: '72px',
              height: '1px',
              background: 'linear-gradient(to right, transparent, #B8860B, transparent)',
            }}
          />
        </div>

        {/* ═══ BENTO GRID ═══ */}
        <div
          ref={gridRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 auto-rows-[minmax(240px,auto)]"
        >
          {procedures.map((procedure, index) => {
            const isHero = index === 0;
            const isTall = index === 3;
            const num = String(index + 1).padStart(2, '0');

            return (
              <Link
                key={procedure.slug}
                href={`/${locale}/procedures/${procedure.slug}`}
                data-card
                className={`group relative block overflow-hidden ${gridAreas[index] || ''}`}
                style={{ textDecoration: 'none' }}
              >
                {/* Card surface */}
                <div
                  className="relative w-full h-full flex flex-col justify-end"
                  style={{
                    backgroundColor: cardTones[index],
                    minHeight: isHero ? '480px' : isTall ? '480px' : '240px',
                    padding: isHero ? 'clamp(28px, 3vw, 48px)' : 'clamp(24px, 2.5vw, 36px)',
                    transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                >
                  {/* Gold gradient border — revealed on hover */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'linear-gradient(135deg, rgba(184,134,11,0.3), rgba(212,175,55,0.1), rgba(184,134,11,0.3))',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMaskComposite: 'xor',
                      padding: '1px',
                    }}
                  />

                  {/* Warm radial vignette at bottom */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse 80% 50% at 50% 100%, rgba(184,134,11,0.06) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Large watermark number */}
                  <span
                    className="absolute pointer-events-none select-none transition-all duration-700 group-hover:opacity-[0.08]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: isHero ? 'clamp(140px, 18vw, 240px)' : isTall ? 'clamp(100px, 12vw, 160px)' : 'clamp(80px, 10vw, 120px)',
                      fontWeight: 300,
                      color: '#B8860B',
                      opacity: 0.04,
                      lineHeight: 1,
                      top: isHero ? '-10px' : '-5px',
                      right: isHero ? '20px' : '12px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {num}
                  </span>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Number label */}
                    <span
                      className="block mb-3"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#B8860B',
                        letterSpacing: '0.2em',
                        opacity: 0.7,
                      }}
                    >
                      {num}
                    </span>

                    {/* Title */}
                    <h3
                      className="transition-colors duration-500"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: isHero
                          ? 'clamp(32px, 4.5vw, 56px)'
                          : 'clamp(24px, 3vw, 36px)',
                        fontWeight: 300,
                        color: '#FAF7F2',
                        letterSpacing: '0.03em',
                        lineHeight: 1.15,
                        marginBottom: isHero ? '16px' : '10px',
                      }}
                    >
                      <span className="group-hover:text-[#D4AF37] transition-colors duration-500">
                        {procedure.title}
                      </span>
                    </h3>

                    {/* Gold rule */}
                    <div
                      className="origin-left transition-transform duration-600 group-hover:scale-x-150"
                      style={{
                        width: isHero ? '48px' : '32px',
                        height: '1px',
                        background: 'linear-gradient(to right, #B8860B, transparent)',
                        marginBottom: isHero ? '16px' : '10px',
                      }}
                    />

                    {/* Description — only on hero and tall cards */}
                    {(isHero || isTall) && (
                      <p
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: 'clamp(14px, 1.3vw, 17px)',
                          fontWeight: 300,
                          color: 'rgba(250,247,242,0.5)',
                          lineHeight: 1.7,
                          maxWidth: '400px',
                          marginBottom: '20px',
                        }}
                      >
                        {procedure.shortDescription}
                      </p>
                    )}

                    {/* Explore link */}
                    <div className="flex items-center gap-3">
                      <span
                        className="uppercase transition-all duration-500 group-hover:tracking-[0.3em]"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: '11px',
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          color: '#B8860B',
                        }}
                      >
                        Explore
                      </span>
                      <svg
                        width="28"
                        height="8"
                        viewBox="0 0 28 8"
                        fill="none"
                        className="overflow-visible"
                      >
                        <line
                          x1="0" y1="4" x2="20" y2="4"
                          stroke="#B8860B"
                          strokeWidth="0.75"
                          className="origin-left transition-transform duration-500 group-hover:scale-x-[1.4]"
                        />
                        <path
                          d="M18 1.5L22 4L18 6.5"
                          stroke="#B8860B"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-500 group-hover:translate-x-1.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Corner brackets — hero card only */}
                  {isHero && (
                    <>
                      <div
                        className="absolute top-5 left-5 w-6 h-6 pointer-events-none"
                        style={{
                          borderTop: '1px solid rgba(184,134,11,0.2)',
                          borderLeft: '1px solid rgba(184,134,11,0.2)',
                        }}
                      />
                      <div
                        className="absolute top-5 right-5 w-6 h-6 pointer-events-none"
                        style={{
                          borderTop: '1px solid rgba(184,134,11,0.2)',
                          borderRight: '1px solid rgba(184,134,11,0.2)',
                        }}
                      />
                      <div
                        className="absolute bottom-5 left-5 w-6 h-6 pointer-events-none"
                        style={{
                          borderBottom: '1px solid rgba(184,134,11,0.2)',
                          borderLeft: '1px solid rgba(184,134,11,0.2)',
                        }}
                      />
                      <div
                        className="absolute bottom-5 right-5 w-6 h-6 pointer-events-none"
                        style={{
                          borderBottom: '1px solid rgba(184,134,11,0.2)',
                          borderRight: '1px solid rgba(184,134,11,0.2)',
                        }}
                      />
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* ═══ VIEW ALL CTA ═══ */}
        <div className="py-24 lg:py-32 text-center">
          <Link
            href={`/${locale}/procedures`}
            className="group inline-block"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="inline-block"
              style={{
                padding: '18px 54px',
                border: '1px solid #B8860B',
                background: 'transparent',
                color: '#B8860B',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase' as const,
                transition: 'background 0.4s ease, color 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#B8860B';
                e.currentTarget.style.color = '#FFF8E7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#B8860B';
              }}
            >
              {dict.home.services.viewAll}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
