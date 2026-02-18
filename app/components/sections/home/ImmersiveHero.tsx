'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface ImmersiveHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

// ════════════════════════════════════════════════════════
// MORPHING SVG SHAPES — Each is a closed path centered
// around a 500x500 viewBox center (250,250)
// These represent: organic blob, flowing wave, geometric
// facet, silk ribbon, and a refined ellipse
// ════════════════════════════════════════════════════════

const MORPH_SHAPES = [
  // Shape 1: Organic Blob — soft, living, cellular
  'M250,80 C340,80 420,130 440,200 C460,270 430,350 390,400 C350,450 290,470 250,470 C210,470 150,450 110,400 C70,350 40,270 60,200 C80,130 160,80 250,80 Z',
  // Shape 2: Flowing Wave — horizontal motion, fluid
  'M60,250 C60,160 120,90 200,80 C280,70 320,130 350,180 C380,230 420,200 450,220 C480,240 480,300 440,350 C400,400 340,430 280,440 C220,450 140,420 100,370 C60,320 60,280 60,250 Z',
  // Shape 3: Geometric Facet — crystalline, precise
  'M250,60 L400,140 L460,280 L420,420 L280,470 L140,440 L60,310 L80,170 L170,90 Z',
  // Shape 4: Silk Ribbon — asymmetric elegance
  'M120,120 C180,60 320,50 400,100 C480,150 470,240 430,300 C390,360 320,380 290,420 C260,460 200,470 150,430 C100,390 60,330 50,270 C40,210 60,180 120,120 Z',
  // Shape 5: Refined Oval — back toward organic origin
  'M250,70 C360,70 450,150 460,250 C470,350 400,440 300,460 C200,480 100,420 60,320 C20,220 80,120 170,80 C200,72 230,70 250,70 Z',
];

// Secondary inner shape — smaller, more angular, rotates opposite
const INNER_SHAPES = [
  'M250,140 C310,140 360,180 370,230 C380,280 360,340 320,370 C280,400 230,410 200,390 C170,370 140,330 140,280 C140,230 170,160 220,145 C230,142 240,140 250,140 Z',
  'M180,200 C200,160 280,140 330,170 C380,200 390,270 370,320 C350,370 290,390 250,380 C210,370 160,340 150,290 C140,240 160,210 180,200 Z',
  'M250,130 L340,180 L380,260 L350,350 L270,390 L180,360 L140,280 L160,190 Z',
  'M200,160 C240,130 320,140 360,190 C400,240 380,320 340,360 C300,400 230,400 190,360 C150,320 130,260 160,200 C170,180 185,165 200,160 Z',
  'M250,135 C330,135 380,190 385,250 C390,310 350,380 280,390 C210,400 160,360 145,300 C130,240 170,170 230,140 C237,137 244,135 250,135 Z',
];

export default function ImmersiveHero({ locale, dict }: ImmersiveHeroProps) {
  const { gsapReady } = useGsap();

  // Core layout refs
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  // SVG morphing refs
  const svgRef = useRef<SVGSVGElement>(null);
  const morphPathRef = useRef<SVGPathElement>(null);
  const innerPathRef = useRef<SVGPathElement>(null);
  const morphGroupRef = useRef<SVGGElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);

  // Atmosphere refs
  const glowRef = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  // Content refs
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entranceTlRef = useRef<any>(null);
  const hasAnimated = useRef(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // ── Cursor tracking — feeds both glow and SVG warp ──
  useEffect(() => {
    const section = sectionRef.current;
    const glow = cursorGlowRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };

      if (window.gsap && glow) {
        window.gsap.to(glow, {
          left: e.clientX - rect.left,
          top: e.clientY - rect.top,
          duration: 1.2,
          ease: 'power3.out',
        });
      }

      // Warp the SVG group toward cursor
      if (window.gsap && morphGroupRef.current) {
        const offsetX = (mouseRef.current.x - 0.5) * 20;
        const offsetY = (mouseRef.current.y - 0.5) * 15;
        window.gsap.to(morphGroupRef.current, {
          x: offsetX,
          y: offsetY,
          duration: 1.5,
          ease: 'power3.out',
        });
      }
    };

    section.addEventListener('mousemove', handleMove);
    return () => section.removeEventListener('mousemove', handleMove);
  }, [gsapReady]);

  // ── Magnetic button handlers ──
  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    window.gsap.to(btn, {
      x: x * 0.25,
      y: y * 0.25,
      duration: 0.4,
      ease: 'power3.out',
    });
  }, []);

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    window.gsap.to(e.currentTarget, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    });
  }, []);

  // ── Reduced motion + safety fallback ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      [kickerRef, headlineRef, subRef, ctaRef, badgeRef, scrollRef].forEach((r) => {
        if (r.current) r.current.style.opacity = '1';
      });
      if (svgRef.current) svgRef.current.style.opacity = '1';
      if (glowRef.current) glowRef.current.style.opacity = '1';
      if (glow2Ref.current) glow2Ref.current.style.opacity = '1';
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        [kickerRef, headlineRef, subRef, ctaRef, badgeRef, scrollRef].forEach((r) => {
          if (r.current) r.current.style.opacity = '1';
        });
        if (svgRef.current) svgRef.current.style.opacity = '1';
        if (glowRef.current) glowRef.current.style.opacity = '1';
        if (glow2Ref.current) glow2Ref.current.style.opacity = '1';
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // ════════════════════════════════════════════════════════
  // GSAP — LIQUID GOLD MORPHING ORCHESTRATION
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    if (!gsapReady) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const DrawSVG = window.DrawSVGPlugin;
    const MorphSVG = window.MorphSVGPlugin;
    const CE = window.CustomEase;

    if (!gsap || !ST || !SplitText || !DrawSVG || !MorphSVG) return;

    const ctx = gsap.context(() => {
      hasAnimated.current = true;
      // ── Custom Eases ──
      if (CE) {
        CE.create('cinematic', 'M0,0 C0.08,0.82 0.17,1 1,1');
        CE.create('dramatic', 'M0,0 C0.23,1 0.32,1 1,1');
        CE.create('silk', 'M0,0 C0.25,0.1 0.25,1 1,1');
        CE.create('overshoot', 'M0,0 C0.14,0 0.27,0.87 0.5,1 0.58,1.06 0.78,0.98 1,1');
      }
      const dramatic = CE ? 'dramatic' : 'power3.out';
      const silk = CE ? 'silk' : 'power2.out';
      const overshoot = CE ? 'overshoot' : 'back.out(1.7)';

      // ════════════════════════════════════════
      // ACT I — THE SHAPE EMERGES (0s → 2.5s)
      // ════════════════════════════════════════
      const master = gsap.timeline();

      // Ambient glows fade in
      if (glowRef.current) {
        master.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 3, ease: 'power1.out' },
          0
        );
      }
      if (glow2Ref.current) {
        master.fromTo(
          glow2Ref.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 2.5, ease: 'power1.out' },
          0.3
        );
      }

      // SVG canvas fades in
      if (svgRef.current) {
        master.fromTo(
          svgRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          0.2
        );
      }

      // Main morphing shape — DrawSVG from 0 to full
      if (morphPathRef.current) {
        master.fromTo(
          morphPathRef.current,
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 2.8, ease: 'power1.inOut' },
          0.4
        );
      }

      // Inner shape draws slightly later
      if (innerPathRef.current) {
        master.fromTo(
          innerPathRef.current,
          { drawSVG: '50% 50%' },
          { drawSVG: '0% 100%', duration: 2, ease: silk },
          0.9
        );
      }

      // Glow path (blurred duplicate) draws in sync
      if (glowPathRef.current) {
        master.fromTo(
          glowPathRef.current,
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 2.8, ease: 'power1.inOut' },
          0.4
        );
      }

      // ════════════════════════════════════════
      // ACT II — CONTENT REVELATION (1.5s → 4s)
      // ════════════════════════════════════════

      // Kicker — text scramble cipher effect
      if (kickerRef.current) {
        const finalText = kickerRef.current.getAttribute('data-text') || '';
        const cipherChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·×+—';

        kickerRef.current.style.opacity = '1';
        kickerRef.current.style.visibility = 'visible';

        const scramble = { progress: 0 };
        master.to(
          scramble,
          {
            progress: 1,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (!kickerRef.current) return;
              const p = scramble.progress;
              const resolved = Math.floor(p * finalText.length);
              let display = '';
              for (let i = 0; i < finalText.length; i++) {
                if (i < resolved) {
                  display += finalText[i];
                } else if (finalText[i] === ' ') {
                  display += ' ';
                } else {
                  display += cipherChars[Math.floor(Math.random() * cipherChars.length)];
                }
              }
              kickerRef.current.textContent = display;
            },
          },
          1.5
        );
      }

      // Headline — per-line SplitText char reveal with 3D rotation
      if (headlineRef.current) {
        headlineRef.current.style.opacity = '1';
        const lineWraps = headlineRef.current.querySelectorAll('.hero-line-wrap');
        const isMobile = window.innerWidth < 768;

        lineWraps.forEach((wrap, idx) => {
          const line = wrap.querySelector('.hero-line');
          if (!line) return;

          const split = new SplitText(line, { type: 'chars, words' });
          const staggerFrom = idx === 0 ? 'start' : idx === 1 ? 'center' : 'end';

          master.fromTo(
            split.chars,
            {
              yPercent: isMobile ? 100 : 140,
              opacity: 0,
              rotateX: isMobile ? 0 : -90,
              scale: 0.6,
            },
            {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              scale: 1,
              duration: isMobile ? 0.8 : 1.4,
              stagger: {
                each: isMobile ? 0.025 : 0.04,
                from: staggerFrom,
                ease: 'power2.in',
              },
              ease: dramatic,
            },
            2.0 + idx * 0.3
          );
        });
      }

      // Subheadline — word-by-word blur resolve
      if (subRef.current) {
        subRef.current.style.opacity = '1';
        const subSplit = new SplitText(subRef.current, { type: 'words' });
        master.fromTo(
          subSplit.words,
          { opacity: 0, y: 20, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.55,
            stagger: 0.035,
            ease: dramatic,
          },
          3.2
        );
      }

      // CTAs — elastic scale-up
      if (ctaRef.current) {
        const buttons = ctaRef.current.querySelectorAll('.cta-btn');
        master.fromTo(
          buttons,
          { opacity: 0, y: 40, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: overshoot,
          },
          3.5
        );
      }

      // Trust badges
      if (badgeRef.current) {
        const badges = badgeRef.current.querySelectorAll('.trust-badge');
        master.fromTo(
          badges,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: overshoot,
          },
          3.8
        );
      }

      // Scroll indicator
      if (scrollRef.current) {
        master.fromTo(
          scrollRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: silk },
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

      entranceTlRef.current = master;

      // ════════════════════════════════════════
      // INFINITE MORPH CYCLE — The Living Shape
      // ════════════════════════════════════════
      const morphCycle = gsap.timeline({ repeat: -1, delay: 3.5 });

      MORPH_SHAPES.forEach((shape, i) => {
        const nextShape = MORPH_SHAPES[(i + 1) % MORPH_SHAPES.length];
        const nextInner = INNER_SHAPES[(i + 1) % INNER_SHAPES.length];

        // Main shape morphs
        if (morphPathRef.current) {
          morphCycle.to(
            morphPathRef.current,
            {
              morphSVG: { shape: nextShape, type: 'rotational', origin: '50% 50%' },
              duration: 4,
              ease: 'power1.inOut',
            },
            i * 4.5
          );
        }

        // Glow shape follows (slightly behind for trail effect)
        if (glowPathRef.current) {
          morphCycle.to(
            glowPathRef.current,
            {
              morphSVG: { shape: nextShape, type: 'rotational', origin: '50% 50%' },
              duration: 4.3,
              ease: 'power1.inOut',
            },
            i * 4.5 + 0.15
          );
        }

        // Inner shape morphs counter-direction
        if (innerPathRef.current) {
          morphCycle.to(
            innerPathRef.current,
            {
              morphSVG: { shape: nextInner, type: 'rotational', origin: '50% 50%' },
              duration: 4.2,
              ease: 'sine.inOut',
            },
            i * 4.5 + 0.3
          );
        }
      });

      // Slow ambient rotation of the SVG group
      if (morphGroupRef.current) {
        gsap.to(morphGroupRef.current, {
          rotation: 360,
          transformOrigin: '250px 250px',
          duration: 120,
          ease: 'none',
          repeat: -1,
        });
      }

      // Inner shape counter-rotates
      if (innerPathRef.current) {
        gsap.to(innerPathRef.current, {
          rotation: -360,
          transformOrigin: '250px 250px',
          duration: 90,
          ease: 'none',
          repeat: -1,
        });
      }

      // Ambient glow pulses
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.08,
          opacity: 0.8,
          duration: 6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 5,
        });
      }

      // ════════════════════════════════════════
      // SCROLL — Shape Expands, Content Dissolves
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

      // The morphing shape scales up massively to engulf the viewport
      if (morphGroupRef.current) {
        scrollTl.to(
          morphGroupRef.current,
          {
            scale: 8,
            opacity: 0.15,
            duration: 1,
            ease: 'power2.in',
          },
          0
        );
      }

      // Ambient glows expand and fade
      if (glowRef.current) {
        scrollTl.to(glowRef.current, { scale: 2, opacity: 0, duration: 0.8 }, 0);
      }
      if (glow2Ref.current) {
        scrollTl.to(glow2Ref.current, { scale: 1.8, opacity: 0, duration: 0.8 }, 0);
      }

      // Content lifts away with blur
      if (contentRef.current) {
        scrollTl.to(
          contentRef.current,
          { y: -200, opacity: 0, filter: 'blur(16px)', duration: 0.4 },
          0.4
        );
      }

      // Scroll indicator vanishes immediately
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
      style={{ backgroundColor: '#07060A' }}
    >
      {/* ── Film grain texture ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* AMBIENT ATMOSPHERE                       */}
      {/* ════════════════════════════════════════ */}

      {/* Primary warm glow — behind the morphing shape */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-[2]"
        style={{
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '70vh',
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, rgba(184,134,11,0.03) 35%, transparent 65%)',
          filter: 'blur(80px)',
          opacity: 0,
        }}
      />

      {/* Secondary cool-bronze accent — lower */}
      <div
        ref={glow2Ref}
        className="absolute pointer-events-none z-[2]"
        style={{
          bottom: '5%',
          left: '30%',
          width: '40vw',
          height: '40vh',
          background: 'radial-gradient(ellipse at center, rgba(184,134,11,0.04) 0%, rgba(140,128,112,0.02) 40%, transparent 65%)',
          filter: 'blur(60px)',
          opacity: 0,
        }}
      />

      {/* ── Cursor-reactive glow (desktop) ── */}
      <div
        ref={cursorGlowRef}
        className="absolute pointer-events-none z-[3] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.045) 0%, transparent 60%)',
          filter: 'blur(50px)',
          left: '50%',
          top: '50%',
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="hero-particle absolute rounded-full"
            style={{
              left: `${5 + ((i * 53) % 90)}%`,
              top: `${8 + ((i * 37) % 84)}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              backgroundColor:
                i % 4 === 0
                  ? 'rgba(212,175,55,0.3)'
                  : i % 4 === 1
                    ? 'rgba(245,225,164,0.15)'
                    : i % 4 === 2
                      ? 'rgba(140,128,112,0.2)'
                      : 'rgba(212,175,55,0.12)',
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${10 + (i % 6) * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════ */}
      {/* SVG MORPHING CANVAS — The Liquid Gold    */}
      {/* ════════════════════════════════════════ */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        viewBox="0 0 500 500"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0 }}
      >
        <defs>
          {/* Gold gradient for the main stroke */}
          <linearGradient id="gold-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6" />
            <stop offset="30%" stopColor="#F5E1A4" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#D4AF37" stopOpacity="0.7" />
            <stop offset="80%" stopColor="#B8860B" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6" />
          </linearGradient>

          {/* Animated shimmer gradient */}
          <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
            <stop offset="40%" stopColor="#F5E1A4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFBE6" stopOpacity="1" />
            <stop offset="60%" stopColor="#F5E1A4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </linearGradient>

          {/* Inner shape gradient — more subtle */}
          <linearGradient id="gold-inner" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#F5E1A4" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#B8860B" stopOpacity="0.12" />
          </linearGradient>

          {/* Glow filter for the outer trail */}
          <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>

          {/* Larger glow for ambient effect */}
          <filter id="gold-glow-large" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>
        </defs>

        <g ref={morphGroupRef}>
          {/* Ambient glow layer — very blurred, gives the shape a halo */}
          <path
            d={MORPH_SHAPES[0]}
            fill="none"
            stroke="rgba(212,175,55,0.08)"
            strokeWidth="12"
            filter="url(#gold-glow-large)"
          />

          {/* Glow trail — slightly delayed morph creates afterglow */}
          <path
            ref={glowPathRef}
            d={MORPH_SHAPES[0]}
            fill="none"
            stroke="rgba(212,175,55,0.12)"
            strokeWidth="4"
            filter="url(#gold-glow)"
          />

          {/* Main morphing shape — the star of the show */}
          <path
            ref={morphPathRef}
            d={MORPH_SHAPES[0]}
            fill="none"
            stroke="url(#gold-stroke)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inner counter-rotating shape */}
          <path
            ref={innerPathRef}
            d={INNER_SHAPES[0]}
            fill="none"
            stroke="url(#gold-inner)"
            strokeWidth="0.8"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* ════════════════════════════════════════ */}
      {/* MAIN CONTENT — Centered in the shape     */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-20"
        style={{ perspective: '1200px', perspectiveOrigin: '50% 40%' }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Kicker — text scramble */}
          <p
            ref={kickerRef}
            data-text={h.kicker}
            className="font-sans text-[10px] md:text-[11px] lg:text-xs uppercase tracking-[0.35em] font-medium mb-7 md:mb-9"
            style={{ color: 'rgba(212,175,55,0.5)', opacity: 0, minHeight: '1.2em' }}
          >
            {h.kicker}
          </p>

          {/* Headline — massive, inside the morphing frame */}
          <div
            ref={headlineRef}
            className="mb-5 md:mb-7"
            style={{ opacity: 0 }}
          >
            {/* Line 1: Cream */}
            <div className="hero-line-wrap overflow-hidden" style={{ paddingBottom: '0.1em' }}>
              <h1
                className="hero-line font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]"
                style={{ color: '#FAF7F2', transformOrigin: 'bottom center' }}
              >
                {h.headlineLine1}
              </h1>
            </div>
            {/* Line 2: Living metallic gold gradient */}
            <div className="hero-line-wrap overflow-hidden" style={{ paddingBottom: '0.1em' }}>
              <h1
                className="hero-line font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] hero-gold-text"
                style={{ transformOrigin: 'bottom center' }}
              >
                {h.headlineLine2}
              </h1>
            </div>
            {/* Line 3: Cream */}
            <div className="hero-line-wrap overflow-hidden" style={{ paddingBottom: '0.1em' }}>
              <h1
                className="hero-line font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]"
                style={{ color: '#FAF7F2', transformOrigin: 'bottom center' }}
              >
                {h.headlineLine3}
              </h1>
            </div>
          </div>

          {/* Subheadline */}
          <p
            ref={subRef}
            className="font-sans text-sm md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-10 md:mb-12"
            style={{ color: 'rgba(250,247,242,0.4)', opacity: 0 }}
          >
            {h.subheadline}
          </p>

          {/* CTAs */}
          <div
            ref={ctaRef}
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-10 md:mb-14"
            style={{ opacity: 0 }}
          >
            {/* Primary CTA */}
            <Link
              href={`/${locale}/contact`}
              className="cta-btn group relative inline-flex items-center justify-center gap-2.5 text-center px-8 md:px-10 py-3.5 md:py-4 font-sans text-xs md:text-sm uppercase tracking-[0.15em] overflow-hidden will-change-transform"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                color: '#07060A',
                borderRadius: '2px',
              }}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="relative z-10 font-semibold">{h.ctaPrimary}</span>
              <ArrowRight size={14} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none">
                <div
                  className="w-1/3 h-full"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
                />
              </div>
            </Link>

            {/* Secondary CTA */}
            <Link
              href={`/${locale}/about`}
              className="cta-btn group inline-flex items-center justify-center gap-2.5 text-center px-8 md:px-10 py-3.5 md:py-4 font-sans text-xs md:text-sm uppercase tracking-[0.15em] will-change-transform transition-all duration-300"
              style={{
                border: '1px solid rgba(212,175,55,0.2)',
                color: '#D4AF37',
                borderRadius: '2px',
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(212,175,55,0.03)',
              }}
              onMouseMove={handleMagneticMove}
              onMouseLeave={(e) => {
                handleMagneticLeave(e);
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.2)';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(212,175,55,0.03)';
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.5)';
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(212,175,55,0.07)';
              }}
            >
              <Play size={13} className="opacity-70" />
              <span className="relative z-10 font-semibold">How It Works</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div
            ref={badgeRef}
            className="flex flex-wrap gap-3 md:gap-6 justify-center"
            style={{ opacity: 0 }}
          >
            {[h.badge1, h.badge2, h.badge3, h.badge4].map(
              (badge: string, i: number) => (
                <span
                  key={i}
                  className="trust-badge inline-flex items-center gap-2 font-sans text-[10px] md:text-[11px] uppercase tracking-[0.15em]"
                  style={{ color: 'rgba(250,247,242,0.3)' }}
                >
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: 'rgba(212,175,55,0.45)' }}
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
          className="font-sans text-[9px] uppercase tracking-[0.35em]"
          style={{ color: 'rgba(250,247,242,0.15)' }}
        >
          {h.scrollHint}
        </p>
        <div
          className="relative w-[1px] h-14 overflow-hidden"
          style={{ backgroundColor: 'rgba(140,128,112,0.08)' }}
        >
          <div
            className="scroll-dot absolute top-0 left-0 w-full h-5"
            style={{ background: 'linear-gradient(to bottom, rgba(212,175,55,0.45), transparent)' }}
          />
        </div>
      </div>

      {/* ── Side accent — vertical text ── */}
      <div className="hidden lg:block absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 z-20">
        <p
          className="font-sans text-[10px] tracking-[0.4em] uppercase"
          style={{ writingMode: 'vertical-rl', color: 'rgba(250,247,242,0.04)' }}
        >
          {h.established}
        </p>
      </div>

      {/* ── Scoped keyframes ── */}
      <style jsx>{`
        @keyframes hero-float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          6% { opacity: 1; }
          94% { opacity: 1; }
          100% {
            transform: translateY(-90vh) translateX(15px);
            opacity: 0;
          }
        }

        .hero-particle {
          animation: hero-float linear infinite;
        }

        @keyframes gold-shimmer-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-gold-text {
          background: linear-gradient(
            135deg,
            #B8860B 0%,
            #D4AF37 20%,
            #F5E1A4 40%,
            #FFFBE6 50%,
            #F5E1A4 60%,
            #D4AF37 80%,
            #B8860B 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gold-shimmer-shift 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-particle {
            animation: none;
            opacity: 0.1;
          }
          .hero-gold-text {
            animation: none;
            background-position: 50% 50%;
          }
        }
      `}</style>
    </section>
  );
}
