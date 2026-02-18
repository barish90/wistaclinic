'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface SilkHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

// ════════════════════════════════════════════════════════
// THE SILK THREAD — A flowing bezier curve spanning the viewport
// ViewBox: 1400 × 700 — stretches to fill any viewport
// An elegant double S-curve: the moment silk catches air
// ════════════════════════════════════════════════════════
const SILK_PATH =
  'M -30,350 C 150,220 320,480 520,340 C 720,200 870,470 1080,330 C 1230,240 1400,390 1430,350';

export default function SilkHero({ locale, dict }: SilkHeroProps) {
  const { gsapReady } = useGsap();

  // ── Refs ──
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const silkRef = useRef<SVGPathElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  const silkGroupRef = useRef<SVGGElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // ── Mouse tracking — silk bows toward cursor ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };

      if (!window.gsap) return;

      // The silk bows more at its center (sine distribution)
      const bowStrength = Math.sin(mouseRef.current.x * Math.PI) * 14;
      const yOffset = (mouseRef.current.y - 0.5) * bowStrength;

      if (silkGroupRef.current) {
        window.gsap.to(silkGroupRef.current, {
          y: yOffset,
          duration: 2.0,
          ease: 'power3.out',
        });
      }

      // Cursor glow
      if (cursorGlowRef.current) {
        window.gsap.to(cursorGlowRef.current, {
          left: e.clientX - rect.left,
          top: e.clientY - rect.top,
          duration: 1.2,
          ease: 'power3.out',
        });
      }
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
    window.gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: 'power3.out' });
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
      [kickerRef, headlineRef, subRef, ctaRef, badgeRef, scrollRef].forEach((r) => {
        if (r.current) r.current.style.opacity = '1';
      });
      if (svgRef.current) svgRef.current.style.opacity = '1';
      if (veilRef.current) veilRef.current.style.clipPath = 'inset(0 0% 0 0)';
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        [kickerRef, headlineRef, subRef, ctaRef, badgeRef, scrollRef].forEach((r) => {
          if (r.current) r.current.style.opacity = '1';
        });
        if (svgRef.current) svgRef.current.style.opacity = '1';
        if (veilRef.current) veilRef.current.style.clipPath = 'inset(0 0% 0 0)';
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // ════════════════════════════════════════════════════════
  // GSAP — SILK UNFURLING: Cinematic Motion Poetry
  // A single thread of gold traces across the void,
  // revealing everything in its wake
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
      // ── Custom eases ──
      if (CE) {
        CE.create('cinematic', 'M0,0 C0.08,0.82 0.17,1 1,1');
        CE.create('dramatic', 'M0,0 C0.23,1 0.32,1 1,1');
        CE.create('silk', 'M0,0 C0.25,0.1 0.25,1 1,1');
        // The unfurl ease — slow start, accelerates through middle, gentle decel at end
        CE.create('unfurl', 'M0,0 C0.08,0.3 0.18,0.75 0.45,0.9 0.72,1.04 0.88,1 1,1');
      }
      const dramatic = CE ? 'dramatic' : 'power3.out';
      const silk = CE ? 'silk' : 'power2.out';
      const unfurl = CE ? 'unfurl' : 'power2.inOut';

      const master = gsap.timeline();

      // ════════════════════════════════════════
      // ACT I — THE THREAD AWAKENS
      // From absolute void, a luminous filament
      // begins its journey across the dark
      // ════════════════════════════════════════

      // SVG fades in
      if (svgRef.current) {
        master.fromTo(
          svgRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          0.3
        );
      }

      // Main silk thread — DrawSVG from left to right
      if (silkRef.current) {
        master.fromTo(
          silkRef.current,
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 3.5, ease: unfurl },
          0.8
        );
      }

      // Ghost thread — follows 300ms behind, creates depth
      if (ghostRef.current) {
        master.fromTo(
          ghostRef.current,
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 3.8, ease: unfurl },
          1.1
        );
      }

      // The Veil — translucent gold sweeps left to right
      if (veilRef.current) {
        master.to(
          veilRef.current,
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 3.5,
            ease: unfurl,
          },
          0.8
        );
      }

      // ════════════════════════════════════════
      // ACT II — TEXT REVEALED BY SILK
      // Chars materialize as the thread passes,
      // like sunlight sweeping across a wall
      // ════════════════════════════════════════

      // Kicker — cipher decode, starts as silk enters center
      if (kickerRef.current) {
        const finalText = kickerRef.current.getAttribute('data-text') || '';
        const cipher = '—·+ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        kickerRef.current.style.opacity = '1';
        const scramble = { progress: 0 };
        master.to(
          scramble,
          {
            progress: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (!kickerRef.current) return;
              const p = scramble.progress;
              const resolved = Math.floor(p * finalText.length);
              let display = '';
              for (let i = 0; i < finalText.length; i++) {
                if (i < resolved) display += finalText[i];
                else if (finalText[i] === ' ') display += ' ';
                else display += cipher[Math.floor(Math.random() * cipher.length)];
              }
              kickerRef.current.textContent = display;
            },
          },
          1.5
        );
      }

      // Headline — chars revealed progressively as silk passes
      if (headlineRef.current) {
        headlineRef.current.style.opacity = '1';
        const lineWraps = headlineRef.current.querySelectorAll('.hero-line-wrap');
        const allChars: HTMLElement[] = [];

        lineWraps.forEach((wrap) => {
          const line = wrap.querySelector('.hero-line');
          if (!line) return;
          const split = new SplitText(line, { type: 'chars' });
          allChars.push(...(split.chars as HTMLElement[]));
        });

        // Hide all chars initially
        gsap.set(allChars, { opacity: 0, filter: 'blur(6px)' });

        // Pre-compute normalized x-positions of each char
        const vw = window.innerWidth;
        const charXNorm = allChars.map((char) => {
          const rect = char.getBoundingClientRect();
          return (rect.left + rect.width / 2) / vw;
        });

        // Sweep reveal synced to silk draw progress
        const sweepProxy = { progress: 0 };
        const revealed = new Set<number>();

        master.to(
          sweepProxy,
          {
            progress: 1,
            duration: 3.5,
            ease: unfurl,
            onUpdate: () => {
              const p = sweepProxy.progress;
              allChars.forEach((char, i) => {
                // Reveal chars slightly ahead of the silk (3% lookahead)
                if (charXNorm[i] <= p + 0.03 && !revealed.has(i)) {
                  revealed.add(i);
                  gsap.to(char, {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 0.6,
                    ease: 'power2.out',
                  });
                }
              });
            },
          },
          0.8
        );
      }

      // Subheadline — appears after silk passes center
      if (subRef.current) {
        subRef.current.style.opacity = '1';
        const subSplit = new SplitText(subRef.current, { type: 'words' });
        master.fromTo(
          subSplit.words,
          { opacity: 0, y: 12, filter: 'blur(5px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            stagger: 0.035,
            ease: dramatic,
          },
          3.0
        );
      }

      // CTA
      if (ctaRef.current) {
        master.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' },
          3.5
        );
      }

      // Trust badges — whisper-quiet
      if (badgeRef.current) {
        master.fromTo(
          badgeRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: 'power1.out' },
          3.8
        );
      }

      // Scroll indicator
      if (scrollRef.current) {
        master.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: silk },
          4.2
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
      // AMBIENT — The Thread Breathes
      // Once drawn, the silk settles into a
      // gentle breathing undulation
      // ════════════════════════════════════════

      // Breathing oscillation
      if (silkGroupRef.current) {
        gsap.to(silkGroupRef.current, {
          y: 8,
          duration: 4.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 5,
        });
      }

      // Shimmer flowing along the silk stroke
      const silkGradient = svgRef.current?.querySelector('#silk-flow');
      if (silkGradient) {
        gsap.fromTo(
          silkGradient,
          { attr: { x1: -1400, x2: 400 } },
          {
            attr: { x1: 600, x2: 2400 },
            duration: 5,
            ease: 'none',
            repeat: -1,
            delay: 5,
          }
        );
      }

      // ════════════════════════════════════════
      // SCROLL — Silk Lifts, Veil Dissolves
      // The thread ascends like silk caught
      // in an updraft, content fades below
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

      // Silk thread lifts upward and fades
      if (silkGroupRef.current) {
        scrollTl.to(
          silkGroupRef.current,
          { y: -250, opacity: 0, duration: 0.5 },
          0
        );
      }

      // Veil dissolves
      if (veilRef.current) {
        scrollTl.to(veilRef.current, { opacity: 0, duration: 0.35 }, 0.05);
      }

      // Content lifts with parallax blur
      if (contentRef.current) {
        scrollTl.to(
          contentRef.current,
          { y: -180, opacity: 0, filter: 'blur(16px)', duration: 0.4 },
          0.3
        );
      }

      // Scroll indicator vanishes
      if (scrollRef.current) {
        scrollTl.to(scrollRef.current, { opacity: 0, duration: 0.08 }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  const h = dict?.home?.hero ?? {} as Record<string, string>;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#030305' }}
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

      {/* ── Warm center glow — whisper of warmth in the void ── */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '55vw',
          height: '55vh',
          background:
            'radial-gradient(ellipse at center, rgba(212,175,55,0.025) 0%, rgba(184,134,11,0.01) 40%, transparent 60%)',
          filter: 'blur(65px)',
        }}
      />

      {/* ── The Veil — translucent gold that sweeps across ── */}
      <div
        ref={veilRef}
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(212,175,55,0.022) 0%, rgba(245,225,164,0.01) 35%, rgba(184,134,11,0.006) 65%, transparent 100%)',
          clipPath: 'inset(0 100% 0 0)',
        }}
      />

      {/* ── Cursor-reactive glow ── */}
      <div
        ref={cursorGlowRef}
        className="absolute pointer-events-none z-[4] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          width: '420px',
          height: '420px',
          background:
            'radial-gradient(circle, rgba(212,175,55,0.025) 0%, transparent 55%)',
          filter: 'blur(40px)',
          left: '50%',
          top: '50%',
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* THE SILK THREAD — SVG                    */}
      {/* A single luminous filament of gold        */}
      {/* ════════════════════════════════════════ */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[6]"
        viewBox="0 0 1400 700"
        preserveAspectRatio="none"
        style={{ opacity: 0 }}
      >
        <defs>
          {/* Primary gold gradient — flows along the thread */}
          <linearGradient
            id="silk-flow"
            gradientUnits="userSpaceOnUse"
            x1="-200"
            y1="0"
            x2="1600"
            y2="0"
          >
            <stop offset="0%" stopColor="#8B6508" stopOpacity="0.3" />
            <stop offset="18%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="42%" stopColor="#F5E1A4" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFFBE6" stopOpacity="1" />
            <stop offset="58%" stopColor="#F5E1A4" stopOpacity="0.85" />
            <stop offset="82%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B6508" stopOpacity="0.3" />
          </linearGradient>

          {/* Glow filter for the ghost thread */}
          <filter
            id="silk-glow"
            x="-10%"
            y="-80%"
            width="120%"
            height="260%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>

          {/* Wide ambient glow for the aura */}
          <filter
            id="silk-aura"
            x="-10%"
            y="-100%"
            width="120%"
            height="300%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
        </defs>

        <g ref={silkGroupRef}>
          {/* Ambient aura — very wide, very faint gold haze around the path */}
          <path
            d={SILK_PATH}
            fill="none"
            stroke="rgba(212,175,55,0.04)"
            strokeWidth="20"
            filter="url(#silk-aura)"
          />

          {/* Ghost thread — follows behind, lower opacity, creates depth */}
          <path
            ref={ghostRef}
            d={SILK_PATH}
            fill="none"
            stroke="rgba(212,175,55,0.1)"
            strokeWidth="2.5"
            filter="url(#silk-glow)"
            transform="translate(0, -5)"
          />

          {/* Main silk thread — the star performer */}
          <path
            ref={silkRef}
            d={SILK_PATH}
            fill="none"
            stroke="url(#silk-flow)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* ════════════════════════════════════════ */}
      {/* CONTENT — Revealed by the silk's passage  */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-5xl mx-auto">
          {/* Kicker — cipher decode */}
          <p
            ref={kickerRef}
            data-text={h.kicker}
            className="font-sans text-[10px] md:text-[11px] lg:text-xs uppercase tracking-[0.35em] font-medium mb-7 md:mb-9"
            style={{
              color: 'rgba(212,175,55,0.5)',
              opacity: 0,
              minHeight: '1.2em',
            }}
          >
            {h.kicker}
          </p>

          {/* Headline — chars revealed by the silk sweep */}
          <div
            ref={headlineRef}
            className="mb-5 md:mb-7"
            style={{ opacity: 0 }}
          >
            {/* Line 1 */}
            <div
              className="hero-line-wrap overflow-hidden"
              style={{ paddingBottom: '0.1em' }}
            >
              <h1
                className="hero-line font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]"
                style={{ color: '#F0EDE8' }}
              >
                {h.headlineLine1}
              </h1>
            </div>
            {/* Line 2 — living metallic gold */}
            <div
              className="hero-line-wrap overflow-hidden"
              style={{ paddingBottom: '0.1em' }}
            >
              <h1 className="hero-line silk-gold-text font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]">
                {h.headlineLine2}
              </h1>
            </div>
            {/* Line 3 */}
            <div
              className="hero-line-wrap overflow-hidden"
              style={{ paddingBottom: '0.1em' }}
            >
              <h1
                className="hero-line font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]"
                style={{ color: '#F0EDE8' }}
              >
                {h.headlineLine3}
              </h1>
            </div>
          </div>

          {/* Subheadline */}
          <p
            ref={subRef}
            className="font-sans text-sm md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-8 md:mb-10"
            style={{ color: 'rgba(240,237,232,0.35)', opacity: 0 }}
          >
            {h.subheadline}
          </p>

          {/* CTA — singular, confident */}
          <div
            ref={ctaRef}
            className="flex justify-center mb-12 md:mb-16"
            style={{ opacity: 0 }}
          >
            <Link
              href={`/${locale}/contact`}
              className="group relative inline-flex items-center gap-3 font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] overflow-hidden will-change-transform"
              style={{
                color: '#D4AF37',
                padding: '14px 36px',
                border: '1px solid rgba(212,175,55,0.18)',
                borderRadius: '0',
              }}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="relative z-10 font-medium">{h.ctaPrimary}</span>
              <ArrowRight
                size={12}
                className="relative z-10 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500"
              />
              {/* Hover fill — gold slides in from left */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ backgroundColor: 'rgba(212,175,55,0.06)' }}
              />
            </Link>
          </div>

          {/* Trust badges — barely there, a whisper of trust */}
          <div
            ref={badgeRef}
            className="flex flex-wrap gap-4 md:gap-8 justify-center"
            style={{ opacity: 0 }}
          >
            {[h.badge1, h.badge2, h.badge3, h.badge4].map(
              (badge: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 font-sans text-[9px] md:text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'rgba(240,237,232,0.15)' }}
                >
                  <span
                    className="w-[3px] h-[3px] rounded-full"
                    style={{ backgroundColor: 'rgba(212,175,55,0.3)' }}
                  />
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
          className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.35em]"
          style={{ color: 'rgba(240,237,232,0.12)' }}
        >
          {h.scrollHint}
        </p>
        <div
          className="relative w-[1px] h-14 overflow-hidden"
          style={{ backgroundColor: 'rgba(140,128,112,0.08)' }}
        >
          <div
            className="scroll-dot absolute top-0 left-0 w-full h-5"
            style={{
              background:
                'linear-gradient(to bottom, rgba(212,175,55,0.35), transparent)',
            }}
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
        @keyframes silk-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .silk-gold-text {
          background: linear-gradient(
            115deg,
            #8b6508 0%,
            #b8860b 16%,
            #d4af37 32%,
            #f5e1a4 46%,
            #fffbe6 52%,
            #f5e1a4 58%,
            #d4af37 72%,
            #b8860b 86%,
            #8b6508 100%
          );
          background-size: 280% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: silk-shimmer 8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .silk-gold-text {
            animation: none;
            background-position: 50% 50%;
          }
        }
      `}</style>
    </section>
  );
}
