'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface GoldenVeilHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function GoldenVeilHero({ locale, dict }: GoldenVeilHeroProps) {
  const { gsapReady } = useGsap();

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<SVGLineElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const charsRef = useRef<Element[]>([]);

  // ── Cursor proximity — subtle letter displacement ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !charsRef.current.length) return;

    const handleMove = (e: MouseEvent) => {
      if (!window.gsap) return;
      const chars = charsRef.current;
      if (!chars.length) return;

      chars.forEach((char) => {
        const rect = (char as HTMLElement).getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 8;
          const angle = Math.atan2(dy, dx);
          window.gsap.to(char, {
            x: -Math.cos(angle) * force,
            y: -Math.sin(angle) * force,
            duration: 0.6,
            ease: 'power3.out',
          });
        } else {
          window.gsap.to(char, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.4)',
          });
        }
      });
    };

    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, [gsapReady]);

  // ── Magnetic CTA ──
  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    window.gsap.to(btn, {
      x: x * 0.2,
      y: y * 0.2,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, []);

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    window.gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.3)',
    });
  }, []);

  // ── Fallbacks ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      [headlineRef, subRef, ctaRef, badgeRef, scrollRef].forEach((r) => {
        if (r.current) r.current.style.opacity = '1';
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        [headlineRef, subRef, ctaRef, badgeRef, scrollRef].forEach((r) => {
          if (r.current) r.current.style.opacity = '1';
        });
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // ════════════════════════════════════════════════════════
  // GSAP — THE GOLDEN VEIL: Editorial Restraint
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    if (!gsapReady) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const DrawSVG = window.DrawSVGPlugin;
    const CE = window.CustomEase;

    if (!gsap || !ST || !SplitText || !DrawSVG) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      if (CE) {
        CE.create('cinematic', 'M0,0 C0.08,0.82 0.17,1 1,1');
        CE.create('dramatic', 'M0,0 C0.23,1 0.32,1 1,1');
        CE.create('silk', 'M0,0 C0.25,0.1 0.25,1 1,1');
        CE.create('overshoot', 'M0,0 C0.14,0 0.27,0.87 0.5,1 0.58,1.06 0.78,0.98 1,1');
      }
      const cinematic = CE ? 'cinematic' : 'power4.out';
      const dramatic = CE ? 'dramatic' : 'power3.out';
      const silk = CE ? 'silk' : 'power2.out';
      const overshoot = CE ? 'overshoot' : 'back.out(1.7)';

      const master = gsap.timeline();

      // ════════════════════════════════════════
      // ACT I — TYPOGRAPHIC REVELATION
      // The venetian blind effect: each char rotates
      // into view from rotateY(-90), as if flipping
      // open like slats of a blind.
      // ════════════════════════════════════════
      if (headlineRef.current) {
        headlineRef.current.style.opacity = '1';
        const lines = headlineRef.current.querySelectorAll('.veil-line');
        const allChars: Element[] = [];

        lines.forEach((line, idx) => {
          const split = new SplitText(line, { type: 'chars' });
          allChars.push(...split.chars);

          // Each line enters with venetian-blind char rotation
          // Line 1: from left, Line 2: from center, Line 3: from right
          const fromDir = idx === 0 ? 'start' : idx === 1 ? 'center' : 'end';

          master.fromTo(
            split.chars,
            {
              rotateY: -90,
              opacity: 0,
              transformOrigin: 'left center',
            },
            {
              rotateY: 0,
              opacity: 1,
              duration: 1.2,
              stagger: {
                each: 0.06,
                from: fromDir,
              },
              ease: dramatic,
            },
            0.8 + idx * 0.5
          );
        });

        charsRef.current = allChars;
      }

      // Gold hairline rule — DrawSVG from center outward
      if (ruleRef.current) {
        master.fromTo(
          ruleRef.current,
          { drawSVG: '50% 50%' },
          { drawSVG: '0% 100%', duration: 1.2, ease: silk },
          2.4
        );
      }

      // Subheadline — words materialize with blur
      if (subRef.current) {
        subRef.current.style.opacity = '1';
        const subSplit = new SplitText(subRef.current, { type: 'words' });
        master.fromTo(
          subSplit.words,
          { opacity: 0, filter: 'blur(6px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.04,
            ease: dramatic,
          },
          2.8
        );
      }

      // CTA — emerges from nothing
      if (ctaRef.current) {
        master.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: overshoot },
          3.3
        );
      }

      // Trust badges — barely there, fade in
      if (badgeRef.current) {
        master.fromTo(
          badgeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.5, ease: 'power1.out' },
          3.6
        );
      }

      // Scroll indicator
      if (scrollRef.current) {
        master.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: silk },
          4.0
        );

        gsap.to(scrollRef.current.querySelector('.scroll-dot'), {
          y: 24,
          duration: 1.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 5,
        });
      }

      // ════════════════════════════════════════
      // SCROLL — Letter-spacing expansion + dissolve
      // The text itself becomes the scroll effect:
      // letters spread apart like a constellation
      // expanding, then dissolve into nothing.
      // ════════════════════════════════════════
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.5,
          pin: true,
        },
      });

      // Phase 1 (0 → 0.5): Letters expand outward
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll('.veil-line');
        lines.forEach((line) => {
          scrollTl.to(
            line,
            {
              letterSpacing: '0.3em',
              opacity: 0.3,
              duration: 0.5,
            },
            0
          );
        });

        // Phase 2 (0.4 → 0.8): Text dissolves with blur
        scrollTl.to(
          headlineRef.current,
          {
            opacity: 0,
            filter: 'blur(20px)',
            scale: 1.05,
            duration: 0.4,
          },
          0.4
        );
      }

      // Rule fades
      if (ruleRef.current) {
        scrollTl.to(ruleRef.current, { opacity: 0, duration: 0.2 }, 0.2);
      }

      // Sub + CTA dissolve
      if (subRef.current) {
        scrollTl.to(subRef.current, { opacity: 0, y: -30, duration: 0.3 }, 0.3);
      }
      if (ctaRef.current) {
        scrollTl.to(ctaRef.current, { opacity: 0, y: -20, duration: 0.25 }, 0.35);
      }
      if (badgeRef.current) {
        scrollTl.to(badgeRef.current, { opacity: 0, duration: 0.2 }, 0.3);
      }

      // Scroll indicator vanishes
      if (scrollRef.current) {
        scrollTl.to(scrollRef.current, { opacity: 0, duration: 0.08 }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  const h = dict.home.hero;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#050505' }}
    >
      {/* ── Film grain — barely perceptible ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.02,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* CONTENT — Nothing else. Just type.       */}
      {/* ════════════════════════════════════════ */}
      <div className="relative z-10 h-screen flex flex-col justify-center items-center px-6 md:px-12 lg:px-20">
        <div className="w-full max-w-[90vw]">

          {/* THE HEADLINE — fills the viewport */}
          <div
            ref={headlineRef}
            className="mb-6 md:mb-8 perspective-cinematic"
            style={{ opacity: 0 }}
          >
            {/* Line 1: Pure white, massive */}
            <h1
              className="veil-line font-serif text-center leading-[0.85] tracking-[-0.04em] text-[4rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] xl:text-[13rem] 2xl:text-[15rem]"
              style={{
                color: '#F0EDE8',
                willChange: 'transform',
              }}
            >
              {h.headlineLine1}
            </h1>

            {/* Line 2: Living metallic gold — the only color on the page */}
            <h1
              className="veil-line veil-gold font-serif text-center leading-[0.85] tracking-[-0.04em] text-[4rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] xl:text-[13rem] 2xl:text-[15rem]"
              style={{ willChange: 'transform' }}
            >
              {h.headlineLine2}
            </h1>

            {/* Line 3: Pure white */}
            <h1
              className="veil-line font-serif text-center leading-[0.85] tracking-[-0.04em] text-[4rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[10rem] xl:text-[13rem] 2xl:text-[15rem]"
              style={{
                color: '#F0EDE8',
                willChange: 'transform',
              }}
            >
              {h.headlineLine3}
            </h1>
          </div>

          {/* THE RULE — a single gold hairline, the only decoration */}
          <div className="flex justify-center mb-8 md:mb-10">
            <svg width="120" height="1" viewBox="0 0 120 1" className="overflow-visible">
              <line
                ref={ruleRef}
                x1="0"
                y1="0.5"
                x2="120"
                y2="0.5"
                stroke="#D4AF37"
                strokeWidth="0.5"
                strokeOpacity="0.4"
              />
            </svg>
          </div>

          {/* THE SUBHEADLINE — whisper-quiet */}
          <p
            ref={subRef}
            className="font-sans text-center text-xs md:text-sm lg:text-base max-w-md mx-auto leading-relaxed tracking-wide mb-10 md:mb-14"
            style={{ color: 'rgba(240,237,232,0.3)', opacity: 0 }}
          >
            {h.subheadline}
          </p>

          {/* THE CTA — singular, confident */}
          <div
            ref={ctaRef}
            className="flex justify-center mb-16 md:mb-20"
            style={{ opacity: 0 }}
          >
            <Link
              href={`/${locale}/contact`}
              className="group relative inline-flex items-center gap-3 font-sans text-[10px] md:text-xs uppercase tracking-[0.25em] overflow-hidden will-change-transform"
              style={{
                color: '#D4AF37',
                padding: '14px 36px',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: '0',
              }}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="relative z-10 font-medium">{h.ctaPrimary}</span>
              <ArrowRight
                size={12}
                className="relative z-10 opacity-40 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1"
              />
              {/* Hover fill — gold slides in from left */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ backgroundColor: 'rgba(212,175,55,0.06)' }}
              />
            </Link>
          </div>

          {/* THE BADGES — almost invisible, a whisper of trust */}
          <div
            ref={badgeRef}
            className="flex flex-wrap gap-6 md:gap-10 justify-center"
            style={{ opacity: 0 }}
          >
            {[h.badge1, h.badge2, h.badge3, h.badge4].map(
              (badge: string, i: number) => (
                <span
                  key={i}
                  className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: 'rgba(240,237,232,0.12)' }}
                >
                  {badge}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        style={{ opacity: 0 }}
      >
        <p
          className="font-sans text-[8px] uppercase tracking-[0.4em]"
          style={{ color: 'rgba(240,237,232,0.1)' }}
        >
          {h.scrollHint}
        </p>
        <div
          className="relative w-[1px] h-12 overflow-hidden"
          style={{ backgroundColor: 'rgba(212,175,55,0.06)' }}
        >
          <div
            className="scroll-dot absolute top-0 left-0 w-full h-4"
            style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.3), transparent)' }}
          />
        </div>
      </div>

      {/* ── Vertical text — ghost presence ── */}
      <div className="hidden lg:block absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 z-20">
        <p
          className="font-sans text-[9px] tracking-[0.5em] uppercase"
          style={{ writingMode: 'vertical-rl', color: 'rgba(240,237,232,0.03)' }}
        >
          {h.established}
        </p>
      </div>

      {/* ── Scoped styles ── */}
      <style jsx>{`
        @keyframes veil-shimmer {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }

        .veil-gold {
          background: linear-gradient(
            90deg,
            #8B6508 0%,
            #B8860B 15%,
            #D4AF37 30%,
            #F5E1A4 42%,
            #FFFBE6 50%,
            #F5E1A4 58%,
            #D4AF37 70%,
            #B8860B 85%,
            #8B6508 100%
          );
          background-size: 400% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: veil-shimmer 8s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .veil-gold {
            animation: none;
            background-position: 50% 50%;
          }
        }
      `}</style>
    </section>
  );
}
