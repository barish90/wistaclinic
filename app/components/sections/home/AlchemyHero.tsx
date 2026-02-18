'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface AlchemyHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ═══════════════════════════════════
   SVG Shape Definitions
   ═══════════════════════════════════ */

// Form 1: Abstract organic blob (initial + base)
const BLOB = 'M 250 160 C 300 155, 355 190, 360 250 C 365 310, 340 365, 290 380 C 250 392, 200 385, 175 360 C 145 330, 135 290, 140 250 C 145 200, 195 165, 250 160 Z';

// Form 2: Head/crown profile (hair phase)
const HEAD = 'M 250 150 C 295 148, 330 170, 340 210 C 350 250, 345 290, 330 320 C 315 350, 285 365, 250 368 C 215 365, 185 350, 170 320 C 155 290, 150 250, 160 210 C 170 170, 205 148, 250 150 Z';

// Form 3: Two soft ovals merged (breast phase) — a wider, bilobed shape
const TWIN_OVALS = 'M 190 230 C 190 195, 210 175, 230 175 C 245 175, 255 185, 255 200 C 255 185, 265 175, 280 175 C 300 175, 320 195, 320 230 C 320 275, 295 310, 270 325 C 255 335, 245 335, 240 325 C 235 335, 225 335, 210 325 C 185 310, 190 275, 190 230 Z';

// Form 4: Flowing S-curve body contour (BBL phase) — a filled abstract S
const S_CURVE = 'M 235 150 C 240 150, 250 155, 255 165 C 265 185, 270 210, 265 240 C 260 265, 245 280, 240 300 C 232 325, 225 345, 230 370 C 235 390, 250 400, 265 395 C 275 392, 280 380, 278 370 C 275 355, 265 345, 260 330 C 252 310, 258 290, 268 270 C 280 248, 290 225, 285 200 C 280 178, 268 162, 255 155 C 248 152, 240 150, 235 150 Z';

// Hair strands — 18 thin bezier paths originating from top of head shape
// strokeWidth is precomputed to avoid Math.random() during render (hydration mismatch)
const HAIR_STRANDS = [
  { d: 'M 210 158 C 205 130, 200 100, 195 65', strokeWidth: 0.72 },
  { d: 'M 218 153 C 215 120, 218 85, 210 50', strokeWidth: 0.88 },
  { d: 'M 226 150 C 222 115, 220 80, 225 42', strokeWidth: 0.65 },
  { d: 'M 234 148 C 230 110, 228 72, 232 35', strokeWidth: 0.94 },
  { d: 'M 242 147 C 240 108, 238 68, 240 28', strokeWidth: 0.78 },
  { d: 'M 250 146 C 250 105, 250 65, 250 22', strokeWidth: 0.61 },
  { d: 'M 258 147 C 260 108, 262 68, 260 28', strokeWidth: 0.85 },
  { d: 'M 266 148 C 270 110, 272 72, 268 35', strokeWidth: 0.70 },
  { d: 'M 274 150 C 278 115, 280 80, 275 42', strokeWidth: 0.97 },
  { d: 'M 282 153 C 285 120, 282 85, 290 50', strokeWidth: 0.63 },
  { d: 'M 290 158 C 295 130, 300 100, 305 65', strokeWidth: 0.81 },
  { d: 'M 225 151 C 218 118, 212 82, 218 48', strokeWidth: 0.75 },
  { d: 'M 237 148 C 235 112, 232 75, 236 38', strokeWidth: 0.90 },
  { d: 'M 248 146 C 246 106, 245 66, 247 25', strokeWidth: 0.67 },
  { d: 'M 262 148 C 266 112, 268 75, 264 38', strokeWidth: 0.83 },
  { d: 'M 275 151 C 282 118, 288 82, 282 48', strokeWidth: 0.92 },
  { d: 'M 220 155 C 212 125, 208 92, 215 58', strokeWidth: 0.69 },
  { d: 'M 280 155 C 288 125, 292 92, 285 58', strokeWidth: 0.86 },
];

// Guide dots for Phase 3 (waist, hip peak, thigh)
const GUIDE_DOTS = [
  { cx: 265, cy: 240, label: 'Waist' },
  { cx: 230, cy: 300, label: 'Hip' },
  { cx: 260, cy: 370, label: 'Thigh' },
];

/* Phase content */
const PHASES = [
  {
    kicker: 'TRICHOSCULPTURE',
    headline: 'The Art of Density',
    desc: 'Advanced FUE & DHI micro-transplantation — each graft placed with architectural precision for seamless, permanent density that moves naturally.',
    side: 'left' as const,
  },
  {
    kicker: 'SCULPTURAL VOLUME',
    headline: 'Refined Proportion',
    desc: 'Natural breast augmentation with anatomical precision. Ballerina-style results that enhance your silhouette without compromising elegance.',
    side: 'right' as const,
  },
  {
    kicker: 'HARMONIC CONTOUR',
    headline: 'The Mini BBL',
    desc: 'Harmony between waist and hips — athletic, proportional results that celebrate the natural S-curve. Subtle refinement, not transformation.',
    side: 'left' as const,
  },
];

export default function AlchemyHero({ locale, dict }: AlchemyHeroProps) {
  const { gsapReady } = useGsap();

  const sectionRef = useRef<HTMLElement>(null);
  const svgSceneRef = useRef<HTMLDivElement>(null);
  const sculptureRef = useRef<SVGPathElement>(null);
  const reflectionRef = useRef<SVGPathElement>(null);
  const strandRefs = useRef<(SVGPathElement | null)[]>([]);
  const glowRefs = useRef<(SVGCircleElement | null)[]>([]);
  const guideDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const guideLineRefs = useRef<(SVGLineElement | null)[]>([]);

  // Text refs — one set per phase
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);
  const currentPhase = useRef(-1);

  // ── Cursor tilt on sculpture ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (svgSceneRef.current && window.gsap) {
        window.gsap.to(svgSceneRef.current, {
          rotateY: nx * 8,
          rotateX: ny * -5,
          duration: 1,
          ease: 'power2.out',
        });
      }

      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${e.clientX - rect.left}px`;
        cursorGlowRef.current.style.top = `${e.clientY - rect.top}px`;
        cursorGlowRef.current.style.opacity = '1';
      }
    };

    const handleLeave = () => {
      if (svgSceneRef.current && window.gsap) {
        window.gsap.to(svgSceneRef.current, { rotateY: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
      }
      if (cursorGlowRef.current) cursorGlowRef.current.style.opacity = '0';
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, [gsapReady]);

  // ── Magnetic CTA ──
  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    window.gsap.to(btn, { x: (e.clientX - rect.left - rect.width / 2) * 0.25, y: (e.clientY - rect.top - rect.height / 2) * 0.25, duration: 0.4, ease: 'power3.out' });
  }, []);
  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    window.gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
  }, []);

  // ── Fallback ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setContentVisible(true); hasAnimated.current = true; }
    const t = setTimeout(() => { if (!hasAnimated.current) { setContentVisible(true); hasAnimated.current = true; } }, 6000);
    return () => clearTimeout(t);
  }, []);

  // ── GSAP orchestration ──
  useEffect(() => {
    if (!gsapReady || hasAnimated.current) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const CustomEase = window.CustomEase;
    const MorphSVGPlugin = window.MorphSVGPlugin;
    const DrawSVGPlugin = window.DrawSVGPlugin;
    if (!gsap || !ScrollTrigger || !CustomEase) return;

    hasAnimated.current = true;
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    if (SplitText) gsap.registerPlugin(SplitText);
    if (MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);

    CustomEase.create('alchemy', 'M0,0 C0.1,0.7 0.25,1 1,1');

    const ctx = gsap.context(() => {
      // ── Entrance ──
      const eTl = gsap.timeline({ defaults: { ease: 'alchemy' } });
      eTl.fromTo(svgSceneRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1.5 }, 0.2);
      eTl.call(() => setContentVisible(true), [], 0.8);

      // Init: hide strands, glows, guide dots, all text panels
      strandRefs.current.forEach(s => { if (s && DrawSVGPlugin) gsap.set(s, { drawSVG: '0%', opacity: 0 }); });
      glowRefs.current.forEach(g => { if (g) gsap.set(g, { opacity: 0, scale: 0 }); });
      guideDotRefs.current.forEach(d => { if (d) gsap.set(d, { opacity: 0, scale: 0 }); });
      guideLineRefs.current.forEach(l => { if (l) gsap.set(l, { opacity: 0 }); });
      textRefs.current.forEach(t => { if (t) gsap.set(t, { opacity: 0 }); });
      if (ctaRef.current) gsap.set(ctaRef.current, { opacity: 0 });

      // ── Morph tweens (scrubbed) ──
      // Phase 1 morph: blob → head (0-25% scroll)
      if (sculptureRef.current && MorphSVGPlugin) {
        gsap.to(sculptureRef.current, {
          morphSVG: { shape: HEAD, type: 'rotational' },
          scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=100%', scrub: 1.5 },
        });
        // Phase 2 morph: head → twin ovals (100-200% scroll)
        gsap.to(sculptureRef.current, {
          morphSVG: { shape: TWIN_OVALS, type: 'rotational' },
          scrollTrigger: { trigger: sectionRef.current, start: 'top+=' + window.innerHeight + 'px top', end: '+=' + window.innerHeight + 'px', scrub: 1.5 },
        });
        // Phase 3 morph: twin ovals → S-curve (200-300% scroll)
        gsap.to(sculptureRef.current, {
          morphSVG: { shape: S_CURVE, type: 'rotational' },
          scrollTrigger: { trigger: sectionRef.current, start: 'top+=' + (window.innerHeight * 2) + 'px top', end: '+=' + window.innerHeight + 'px', scrub: 1.5 },
        });

        // Reflection follows
        if (reflectionRef.current) {
          gsap.to(reflectionRef.current, {
            morphSVG: { shape: HEAD, type: 'rotational' },
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '+=100%', scrub: 1.5 },
          });
          gsap.to(reflectionRef.current, {
            morphSVG: { shape: TWIN_OVALS, type: 'rotational' },
            scrollTrigger: { trigger: sectionRef.current, start: 'top+=' + window.innerHeight + 'px top', end: '+=' + window.innerHeight + 'px', scrub: 1.5 },
          });
          gsap.to(reflectionRef.current, {
            morphSVG: { shape: S_CURVE, type: 'rotational' },
            scrollTrigger: { trigger: sectionRef.current, start: 'top+=' + (window.innerHeight * 2) + 'px top', end: '+=' + window.innerHeight + 'px', scrub: 1.5 },
          });
        }
      }

      // ── Main scroll controller ──
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400%',
        pin: true,
        scrub: 1.5,
        onUpdate: (self: { progress: number }) => {
          const p = self.progress;

          // Dolly out: scale 1.3 → 0.9
          if (svgSceneRef.current) {
            const s = 1.3 - p * 0.4;
            gsap.set(svgSceneRef.current, { scale: s });
          }

          // Determine phase
          const phase = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;

          // ── Phase-specific controls ──

          // PHASE 0: Hair strands
          if (phase === 0) {
            const pp = p / 0.33;
            // Draw strands in
            strandRefs.current.forEach((s, i) => {
              if (!s || !DrawSVGPlugin) return;
              const start = 0.2 + (i / HAIR_STRANDS.length) * 0.4;
              const prog = Math.max(0, Math.min(1, (pp - start) / 0.4));
              gsap.set(s, { drawSVG: `0% ${prog * 100}%`, opacity: prog > 0 ? 0.7 : 0 });
            });
            // Hide phase 2/3 elements
            glowRefs.current.forEach(g => { if (g) gsap.set(g, { opacity: 0, scale: 0 }); });
            guideDotRefs.current.forEach(d => { if (d) gsap.set(d, { opacity: 0, scale: 0 }); });
            guideLineRefs.current.forEach(l => { if (l) gsap.set(l, { opacity: 0 }); });
          }

          // PHASE 1: Breast — glow rings
          else if (phase === 1) {
            const pp = (p - 0.33) / 0.33;
            // Fade out strands
            strandRefs.current.forEach(s => {
              if (s) gsap.set(s, { opacity: Math.max(0, 1 - pp * 4) });
            });
            // Show glow rings
            glowRefs.current.forEach((g, i) => {
              if (!g) return;
              const start = 0.15 + i * 0.15;
              const prog = Math.max(0, Math.min(1, (pp - start) / 0.3));
              const pulse = 1 + Math.sin(pp * Math.PI * 3) * 0.05;
              gsap.set(g, { opacity: prog * 0.15, scale: prog * pulse });
            });
            // Hide guide dots
            guideDotRefs.current.forEach(d => { if (d) gsap.set(d, { opacity: 0, scale: 0 }); });
            guideLineRefs.current.forEach(l => { if (l) gsap.set(l, { opacity: 0 }); });
          }

          // PHASE 2: Body — guide dots + CTA
          else {
            const pp = (p - 0.66) / 0.34;
            // Hide strands and glows
            strandRefs.current.forEach(s => { if (s) gsap.set(s, { opacity: 0 }); });
            glowRefs.current.forEach(g => { if (g) gsap.set(g, { opacity: Math.max(0, 0.15 - pp * 0.5), scale: Math.max(0, 1 - pp * 2) }); });
            // Show guide dots
            guideDotRefs.current.forEach((d, i) => {
              if (!d) return;
              const start = 0.1 + i * 0.1;
              const prog = Math.max(0, Math.min(1, (pp - start) / 0.25));
              gsap.set(d, { opacity: prog * 0.6, scale: prog });
            });
            guideLineRefs.current.forEach((l, i) => {
              if (!l) return;
              const start = 0.15 + i * 0.1;
              const prog = Math.max(0, Math.min(1, (pp - start) / 0.25));
              gsap.set(l, { opacity: prog * 0.3 });
            });
            // CTA
            if (ctaRef.current) {
              const ctaProg = Math.max(0, Math.min(1, (pp - 0.5) / 0.3));
              gsap.set(ctaRef.current, { opacity: ctaProg, y: (1 - ctaProg) * 15 });
            }
          }

          // ── Text transitions ──
          PHASES.forEach((_, i) => {
            const el = textRefs.current[i];
            if (!el) return;
            const phaseStart = i * 0.33;
            const phaseEnd = (i + 1) * 0.33;
            const inPhase = p >= phaseStart && p < phaseEnd;
            const pp = inPhase ? (p - phaseStart) / 0.33 : 0;

            if (inPhase) {
              // Fade in during first 30% of phase, hold, fade out during last 15%
              let opacity = 1;
              if (pp < 0.25) opacity = pp / 0.25;
              else if (pp > 0.85) opacity = (1 - pp) / 0.15;
              gsap.set(el, { opacity, y: pp < 0.25 ? (1 - pp / 0.25) * 20 : 0 });
            } else {
              gsap.set(el, { opacity: 0 });
            }
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '700px', background: '#FFF8E7' }}
      >
        {/* Subtle grain */}
        <div className="absolute inset-0 alch-grain" style={{ opacity: 0.025 }} />
        {/* Warm center glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(184,134,11,0.04) 0%, transparent 55%)' }} />

        {/* Cursor glow */}
        <div ref={cursorGlowRef} className="absolute pointer-events-none" style={{
          width: '400px', height: '400px', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(184,134,11,0.03) 0%, transparent 50%)',
          borderRadius: '50%', opacity: 0, transition: 'opacity 0.5s ease', zIndex: 1,
        }} />

        {/* ── Central SVG Scene ── */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2, perspective: '800px' }}>
          <div
            ref={svgSceneRef}
            style={{ transformStyle: 'preserve-3d', willChange: 'transform', opacity: 0 }}
          >
            <svg viewBox="130 0 250 500" style={{ width: 'clamp(260px, 28vw, 380px)', height: 'auto' }} fill="none">
              <defs>
                <linearGradient id="alch-bronze" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" />
                  <stop offset="40%" stopColor="#B8860B" />
                  <stop offset="100%" stopColor="#8B6508" />
                </linearGradient>
                <linearGradient id="alch-bronze-light" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F5E1A4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#B8860B" stopOpacity="0.08" />
                </linearGradient>
                <filter id="alch-shadow">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#8B6508" floodOpacity="0.15" />
                </filter>
                <linearGradient id="alch-strand" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#C4A265" />
                  <stop offset="100%" stopColor="#F5E1A4" />
                </linearGradient>
                <linearGradient id="alch-reflect" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#B8860B" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#B8860B" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Reflection (mirrored, faded) */}
              <g transform="translate(0, 780) scale(1, -1)" opacity="0.08">
                <path ref={reflectionRef} d={BLOB} fill="url(#alch-reflect)" />
              </g>

              {/* Hair strands */}
              {HAIR_STRANDS.map((strand, i) => (
                <path
                  key={`strand-${i}`}
                  ref={el => { strandRefs.current[i] = el; }}
                  d={strand.d}
                  stroke="url(#alch-strand)"
                  strokeWidth={strand.strokeWidth}
                  strokeLinecap="round"
                  fill="none"
                  opacity="0"
                  className="alch-strand"
                />
              ))}

              {/* Glow rings (Phase 2) */}
              <circle ref={el => { glowRefs.current[0] = el; }} cx="220" cy="260" r="60" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0" />
              <circle ref={el => { glowRefs.current[1] = el; }} cx="280" cy="260" r="55" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0" />

              {/* Guide dots & lines (Phase 3) */}
              {GUIDE_DOTS.map((dot, i) => (
                <g key={`guide-${i}`}>
                  <circle
                    ref={el => { guideDotRefs.current[i] = el; }}
                    cx={dot.cx} cy={dot.cy} r="3"
                    fill="#B8860B" opacity="0"
                  />
                  <line
                    ref={el => { guideLineRefs.current[i] = el; }}
                    x1={dot.cx + 8} y1={dot.cy}
                    x2={dot.cx + 45} y2={dot.cy}
                    stroke="#D4C4A8" strokeWidth="0.5" strokeDasharray="2 3" opacity="0"
                  />
                </g>
              ))}

              {/* Main sculpture */}
              <path
                ref={sculptureRef}
                d={BLOB}
                fill="url(#alch-bronze)"
                filter="url(#alch-shadow)"
              />
            </svg>
          </div>
        </div>

        {/* ── Phase Text Panels ── */}
        {PHASES.map((phase, i) => (
          <div
            key={i}
            ref={el => { textRefs.current[i] = el; }}
            className={`absolute top-1/2 -translate-y-1/2 opacity-0 ${phase.side === 'left' ? 'left-[5%] lg:left-[8%]' : 'right-[5%] lg:right-[8%]'}`}
            style={{ zIndex: 3, maxWidth: 'clamp(280px, 28vw, 360px)' }}
          >
            <div style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase',
              color: '#B8860B', marginBottom: '14px', fontWeight: 500,
            }}>
              {phase.kicker}
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(32px, 3.8vw, 60px)', fontWeight: 300,
              lineHeight: 1.05, letterSpacing: '-0.02em',
              color: '#2C2620', marginBottom: '16px',
            }}>
              {phase.headline}
            </div>
            <div style={{ width: '40px', height: '1.5px', background: '#B8860B', marginBottom: '16px', borderRadius: '1px' }} />
            <p style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: 1.7,
              color: '#8C8070', fontWeight: 300,
            }}>
              {phase.desc}
            </p>
          </div>
        ))}

        {/* ── CTA (Phase 3) ── */}
        <div
          ref={ctaRef}
          className="absolute bottom-[12%] left-1/2 -translate-x-1/2 opacity-0"
          style={{ zIndex: 4 }}
        >
          <Link
            href={`/${locale}/contact`}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '15px 32px', background: '#B8860B', color: '#FFF8E7',
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
              borderRadius: '8px', textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(184,134,11,0.2)',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            Begin Your Transformation
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Vignette (very subtle on light bg) */}
        <div className="absolute inset-0 pointer-events-none" style={{
          zIndex: 5, background: 'radial-gradient(ellipse at center, transparent 60%, rgba(255,248,231,0.8) 100%)',
        }} />

        {/* Fallback */}
        {!contentVisible && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20, background: '#FFF8E7' }} />
        )}
      </section>

      <style jsx>{`
        .alch-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: multiply;
        }
        .alch-strand {
          animation: strandSway 4s ease-in-out infinite alternate;
        }
        .alch-strand:nth-child(odd) { animation-delay: -1.5s; animation-duration: 3.5s; }
        .alch-strand:nth-child(3n) { animation-delay: -0.8s; animation-duration: 4.5s; }
        @keyframes strandSway {
          0%   { transform: translateX(0) rotate(0deg); }
          100% { transform: translateX(1.5px) rotate(0.5deg); }
        }
      `}</style>
    </>
  );
}
