'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface GoldenThreadHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ═══════════════════════════════════════════════
   SVG Path Definitions — Single continuous strokes
   MorphSVG morphs between these shapes.
   ═══════════════════════════════════════════════ */

// Shape 0: Simple vertical line (initial state)
const VERTICAL_LINE = 'M 200,40 L 200,360';

// Shape 1: Hair follicle — central shaft with radiating growth curves
// A stylized botanical illustration of follicle architecture
const FOLLICLE =
  'M 200,40 C 200,80 200,120 200,180 ' +
  'C 200,200 180,210 160,230 ' +
  'C 140,250 120,260 110,290 ' +
  'C 100,310 115,340 140,350 ' +
  'C 160,358 180,350 200,330 ' +
  'C 220,350 240,358 260,350 ' +
  'C 285,340 300,310 290,290 ' +
  'C 280,260 260,250 240,230 ' +
  'C 220,210 200,200 200,180';

// Shape 2: Two symmetrical arcs — natural breast contour
const DOUBLE_ARC =
  'M 80,300 ' +
  'C 80,200 140,100 200,100 ' +
  'C 200,100 200,100 200,100 ' +
  'C 200,100 200,100 200,100 ' +
  'C 260,100 320,200 320,300 ' +
  'C 320,300 320,300 320,300 ' +
  'C 320,300 320,300 320,300 ' +
  'C 320,300 260,310 200,300 ' +
  'C 140,310 80,300 80,300';

// Shape 3: S-curve — waist-to-hip body silhouette
const S_CURVE =
  'M 200,30 ' +
  'C 200,60 230,100 240,140 ' +
  'C 250,180 260,200 250,230 ' +
  'C 240,260 210,270 190,290 ' +
  'C 170,310 155,340 160,360 ' +
  'C 165,380 180,395 200,400 ' +
  'C 220,395 235,380 240,360 ' +
  'C 245,340 230,310 210,290 ' +
  'C 210,290 210,290 210,290';

// Shape 4: Rounded rectangle — resolves into CTA button border
const CTA_RECT =
  'M 110,160 ' +
  'L 290,160 ' +
  'C 310,160 320,170 320,190 ' +
  'L 320,210 ' +
  'C 320,230 310,240 290,240 ' +
  'L 110,240 ' +
  'C 90,240 80,230 80,210 ' +
  'L 80,190 ' +
  'C 80,170 90,160 110,160';

/* ── Phase content data ── */
const PHASES = [
  {
    keyword: 'TrichoSculpture',
    title: 'HAIR RESTORATION',
    brief: 'Follicle-level artistry. Each graft placed with architectural precision.',
    side: 'right' as const,
  },
  {
    keyword: 'Ballerina',
    title: 'BREAST AUGMENTATION',
    brief: 'Proportional harmony. Natural volume that moves with you.',
    side: 'left' as const,
  },
  {
    keyword: 'Harmony',
    title: 'BBL & BODY CONTOURING',
    brief: 'The art of proportion. Sculpted curves in perfect balance.',
    side: 'right' as const,
  },
];

const TRUST_SIGNALS = ['JCI Accredited', '15+ Years', '10,000+ Patients', '98% Satisfaction'];

const PROGRESS_LABELS = ['Hair', 'Breast', 'Body', 'Consult'];

export default function GoldenThreadHero({ locale, dict }: GoldenThreadHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  /* ── Refs ── */
  const sectionRef = useRef<HTMLElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const phaseTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaBlockRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const progressDotRef = useRef<HTMLDivElement>(null);
  const progressLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const hasAnimated = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);

  /* ── GSAP animation ── */
  useEffect(() => {
    if (!gsapReady || hasAnimated.current) return;

    const gsap = (window as unknown as { gsap: any }).gsap;
    const ScrollTrigger = (window as unknown as { ScrollTrigger: any }).ScrollTrigger;
    const MorphSVGPlugin = (window as unknown as { MorphSVGPlugin: any }).MorphSVGPlugin;
    const DrawSVGPlugin = (window as unknown as { DrawSVGPlugin: any }).DrawSVGPlugin;
    const CustomEase = (window as unknown as { CustomEase: any }).CustomEase;

    if (!gsap || !ScrollTrigger || !sectionRef.current) return;
    hasAnimated.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setContentVisible(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
    if (CustomEase) {
      gsap.registerPlugin(CustomEase);
      CustomEase.create('threadEase', 'M0,0 C0.22,0.61 0.36,1 1,1');
    }

    setContentVisible(true);

    const section = sectionRef.current;
    const thread = threadRef.current;
    const glow = glowRef.current;
    const ease = CustomEase ? 'threadEase' : 'power2.inOut';

    if (!thread) return;

    // Set initial DrawSVG state
    if (DrawSVGPlugin) {
      gsap.set(thread, { drawSVG: '0%' });
      if (glow) gsap.set(glow, { drawSVG: '0%' });
    } else {
      // Fallback when DrawSVGPlugin is not available
      thread.style.strokeDasharray = '2000';
      thread.style.strokeDashoffset = '2000';
      if (glow) {
        glow.style.strokeDasharray = '2000';
        glow.style.strokeDashoffset = '2000';
      }
    }

    /* ── Kicker entrance on load ── */
    gsap.fromTo(kickerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.4 }
    );

    /* ── Master pinned timeline ── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self: { progress: number }) => {
          // Progress indicator dot
          if (progressDotRef.current) {
            progressDotRef.current.style.top = `${10 + self.progress * 80}%`;
          }
          // Highlight active label
          const phase = Math.min(3, Math.floor(self.progress * 4));
          progressLabelRefs.current.forEach((el, i) => {
            if (el) {
              el.style.opacity = i === phase ? '1' : '0.3';
              el.style.fontWeight = i === phase ? '600' : '400';
            }
          });
        },
      },
    });

    /* ══════════════════════════════════
       PHASE 0 (0–0.10): Thread begins — vertical line draws
       ══════════════════════════════════ */
    tl.to(thread, {
      drawSVG: '100%',
      duration: 0.08,
      ease: 'power1.in',
    }, 0);
    if (glow) {
      tl.to(glow, { drawSVG: '100%', duration: 0.08, ease: 'power1.in' }, 0);
    }
    // Fade out kicker as we transition
    tl.to(kickerRef.current, { opacity: 0, y: -15, duration: 0.04 }, 0.08);

    /* ══════════════════════════════════
       PHASE 1 (0.10–0.30): Morph to Follicle + Hair text
       ══════════════════════════════════ */
    // Morph shape
    tl.to(thread, {
      morphSVG: { shape: FOLLICLE, shapeIndex: 'auto' },
      duration: 0.10,
      ease,
    }, 0.10);
    if (glow) {
      tl.to(glow, {
        morphSVG: { shape: FOLLICLE, shapeIndex: 'auto' },
        duration: 0.10,
        ease,
      }, 0.10);
    }
    // Keep fully drawn during morph
    tl.set(thread, { drawSVG: '100%' }, 0.16);
    // Phase 1 text in
    tl.fromTo(phaseTextRefs.current[0],
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.06, ease: 'power2.out' },
      0.16
    );
    // Phase 1 text out
    tl.to(phaseTextRefs.current[0],
      { opacity: 0, x: -20, duration: 0.04 },
      0.27
    );

    /* ══════════════════════════════════
       PHASE 2 (0.30–0.55): Morph to Double Arc + Breast text
       ══════════════════════════════════ */
    tl.to(thread, {
      morphSVG: { shape: DOUBLE_ARC, shapeIndex: 'auto' },
      duration: 0.10,
      ease,
    }, 0.30);
    if (glow) {
      tl.to(glow, {
        morphSVG: { shape: DOUBLE_ARC, shapeIndex: 'auto' },
        duration: 0.10,
        ease,
      }, 0.30);
    }
    // Phase 2 text in (from left side)
    tl.fromTo(phaseTextRefs.current[1],
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.06, ease: 'power2.out' },
      0.37
    );
    // Phase 2 text out
    tl.to(phaseTextRefs.current[1],
      { opacity: 0, x: 20, duration: 0.04 },
      0.50
    );

    /* ══════════════════════════════════
       PHASE 3 (0.55–0.80): Morph to S-Curve + Body text
       ══════════════════════════════════ */
    tl.to(thread, {
      morphSVG: { shape: S_CURVE, shapeIndex: 'auto' },
      duration: 0.10,
      ease,
    }, 0.55);
    if (glow) {
      tl.to(glow, {
        morphSVG: { shape: S_CURVE, shapeIndex: 'auto' },
        duration: 0.10,
        ease,
      }, 0.55);
    }
    // Phase 3 text in
    tl.fromTo(phaseTextRefs.current[2],
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.06, ease: 'power2.out' },
      0.62
    );
    // Phase 3 text out
    tl.to(phaseTextRefs.current[2],
      { opacity: 0, x: -20, duration: 0.04 },
      0.76
    );

    /* ══════════════════════════════════
       PHASE 4 (0.80–1.0): Morph to CTA rectangle + button text
       ══════════════════════════════════ */
    tl.to(thread, {
      morphSVG: { shape: CTA_RECT, shapeIndex: 'auto' },
      duration: 0.10,
      ease,
    }, 0.80);
    if (glow) {
      tl.to(glow, {
        morphSVG: { shape: CTA_RECT, shapeIndex: 'auto' },
        duration: 0.10,
        ease,
      }, 0.80);
    }
    // CTA text inside the rectangle
    if (ctaTextRef.current) {
      tl.fromTo(ctaTextRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.06, ease: 'back.out(1.5)' },
        0.88
      );
    }
    // Trust signals below
    if (trustRef.current) {
      tl.fromTo(trustRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' },
        0.92
      );
    }

    // Subtle thread glow pulse (CSS animation handles the continuous pulse)

    const fallback = setTimeout(() => setContentVisible(true), 5000);

    return () => {
      clearTimeout(fallback);
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [gsapReady]);

  return (
    <section
      ref={sectionRef}
      className="gt-hero"
      style={{ visibility: contentVisible ? 'visible' : 'hidden' }}
    >
      {/* ── Kicker text (initial) ── */}
      <div ref={kickerRef} className="gt-kicker" style={{ opacity: 0 }}>
        <span className="gt-kicker-label">The Golden Thread</span>
        <span className="gt-kicker-sub">One continuous line. Three transformations.</span>
      </div>

      {/* ── Central SVG canvas ── */}
      <div className="gt-svg-wrap">
        <svg
          className="gt-svg"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glow filter */}
          <defs>
            <filter id="threadGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 0.7 0 0 0  0 0 0 0 0  0 0 0 0.4 0" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Glow layer (behind) */}
          <path
            ref={glowRef}
            d={VERTICAL_LINE}
            stroke="rgba(184,134,11,0.25)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#threadGlow)"
          />
          {/* Main thread */}
          <path
            ref={threadRef}
            d={VERTICAL_LINE}
            stroke="#B8860B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* ── Phase text blocks ── */}
      {PHASES.map((phase, idx) => (
        <div
          key={idx}
          ref={(el) => { phaseTextRefs.current[idx] = el; }}
          className={`gt-phase-text gt-phase-${phase.side}`}
          style={{ opacity: 0 }}
        >
          <span className="gt-phase-title">{phase.title}</span>
          <h2 className="gt-phase-keyword">{phase.keyword}</h2>
          <p className="gt-phase-brief">{phase.brief}</p>
        </div>
      ))}

      {/* ── CTA block (appears when thread becomes rectangle) ── */}
      <div ref={ctaBlockRef} className="gt-cta-wrap">
        <div ref={ctaTextRef} className="gt-cta-inner" style={{ opacity: 0 }}>
          <Link href={`/${locale}/contact`} className="gt-cta-link">
            {hero.ctaPrimary || 'Book Your Consultation'}
            <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </Link>
        </div>
      </div>

      {/* ── Trust signals ── */}
      <div ref={trustRef} className="gt-trust" style={{ opacity: 0 }}>
        {TRUST_SIGNALS.map((t, i) => (
          <span key={i} className="gt-trust-item">{t}</span>
        ))}
      </div>

      {/* ── Progress indicator (right edge) ── */}
      <div className="gt-progress">
        <div className="gt-progress-track" />
        <div ref={progressDotRef} className="gt-progress-dot" />
        {PROGRESS_LABELS.map((label, i) => (
          <span
            key={i}
            ref={(el) => { progressLabelRefs.current[i] = el; }}
            className="gt-progress-label"
            style={{ top: `${12 + i * 22}%` }}
          >
            {label}
          </span>
        ))}
      </div>

      <style jsx>{`
        .gt-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #FFF8E7;
          font-family: 'Cormorant Garamond', 'Georgia', serif;
        }

        /* ── Kicker ── */
        .gt-kicker {
          position: absolute;
          top: 12%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          text-align: center;
        }
        .gt-kicker-label {
          font-size: 12px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #B8860B;
          font-weight: 500;
        }
        .gt-kicker-sub {
          font-size: clamp(14px, 1.5vw, 18px);
          color: #8C8070;
          font-weight: 300;
          font-style: italic;
        }

        /* ── SVG container ── */
        .gt-svg-wrap {
          position: absolute;
          top: 50%;
          left: 45%;
          transform: translate(-50%, -50%);
          width: clamp(280px, 32vw, 400px);
          height: clamp(280px, 32vw, 400px);
          z-index: 5;
        }
        .gt-svg {
          width: 100%;
          height: 100%;
        }

        /* ── Phase text blocks ── */
        .gt-phase-text {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: min(380px, 35vw);
        }
        .gt-phase-right {
          right: 8%;
          text-align: left;
        }
        .gt-phase-left {
          left: 8%;
          text-align: left;
        }
        .gt-phase-title {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #B8860B;
          font-weight: 500;
        }
        .gt-phase-keyword {
          font-size: clamp(32px, 4vw, 64px);
          font-weight: 300;
          color: #2C2620;
          line-height: 1.05;
          margin: 0;
          letter-spacing: -0.01em;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .gt-phase-brief {
          font-size: clamp(14px, 1.2vw, 17px);
          font-weight: 300;
          color: #8C8070;
          line-height: 1.6;
          margin: 0.3rem 0 0;
          max-width: 300px;
        }

        /* ── CTA block ── */
        .gt-cta-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          pointer-events: none;
        }
        .gt-cta-inner {
          pointer-events: auto;
        }
        .gt-cta-link {
          display: inline-flex;
          align-items: center;
          padding: 0.9em 2.2em;
          background: transparent;
          color: #B8860B;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(15px, 1.4vw, 19px);
          font-weight: 600;
          letter-spacing: 0.08em;
          text-decoration: none;
          transition: color 0.3s ease, background 0.3s ease;
          white-space: nowrap;
        }
        .gt-cta-link:hover {
          background: #B8860B;
          color: #FFF8E7;
        }

        /* ── Trust signals ── */
        .gt-trust {
          position: absolute;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .gt-trust-item {
          font-size: clamp(10px, 1vw, 13px);
          color: #8C8070;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 500;
          position: relative;
          padding-left: 1em;
        }
        .gt-trust-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #B8860B;
        }

        /* ── Progress indicator ── */
        .gt-progress {
          position: absolute;
          right: 2.5rem;
          top: 10%;
          bottom: 10%;
          z-index: 15;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 60px;
        }
        .gt-progress-track {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 30px;
          width: 1px;
          background: rgba(184,134,11,0.15);
        }
        .gt-progress-dot {
          position: absolute;
          top: 10%;
          right: 26px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #B8860B;
          box-shadow: 0 0 8px rgba(184,134,11,0.4);
          transition: top 0.1s ease-out;
          transform: translateX(50%);
        }
        .gt-progress-label {
          position: absolute;
          right: 42px;
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #B8860B;
          opacity: 0.3;
          transition: opacity 0.3s ease, font-weight 0.3s ease;
          white-space: nowrap;
          transform: translateY(-50%);
        }

        /* ── Thread glow pulse ── */
        .gt-svg path:first-of-type {
          animation: threadPulse 3s ease-in-out infinite;
        }
        @keyframes threadPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .gt-svg-wrap {
            width: clamp(200px, 50vw, 280px);
            height: clamp(200px, 50vw, 280px);
          }
          .gt-phase-text {
            max-width: 220px;
          }
          .gt-phase-right {
            right: 4%;
          }
          .gt-phase-left {
            left: 4%;
          }
          .gt-phase-keyword {
            font-size: clamp(28px, 7vw, 48px);
          }
          .gt-phase-brief {
            font-size: 13px;
            max-width: 200px;
          }
          .gt-progress {
            right: 0.8rem;
          }
          .gt-progress-label {
            display: none;
          }
          .gt-trust {
            gap: 1rem;
            bottom: 6%;
          }
          .gt-kicker {
            top: 8%;
          }
        }

        @media (max-width: 480px) {
          .gt-phase-right,
          .gt-phase-left {
            left: 50%;
            right: auto;
            transform: translate(-50%, -50%);
            text-align: center;
            top: auto;
            bottom: 12%;
            max-width: 80vw;
          }
          .gt-phase-brief {
            max-width: 80vw;
          }
          .gt-svg-wrap {
            top: 38%;
          }
        }
      `}</style>
    </section>
  );
}
