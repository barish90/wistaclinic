'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface NaturalHarmonyHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ═══════════════════════════════════════════════
   SVG Paths
   ═══════════════════════════════════════════════ */

// Path 1: Macro curve — a single flowing S-curve (waist-hip-thigh contour)
const MACRO_CURVE = 'M 250 750 C 230 680, 200 600, 210 520 C 220 440, 260 380, 250 300 C 240 220, 220 180, 250 120';

// Path 2: Full abstract silhouette — stylized standing figure, one arm raised
// Fashion croquis style: flowing, elegant, suggesting grace
const SILHOUETTE = 'M 250 60 C 240 65, 235 80, 240 95 C 245 105, 255 105, 260 95 C 265 80, 260 65, 250 60 M 250 95 C 248 110, 245 115, 235 125 C 220 140, 200 135, 185 120 C 170 105, 160 85, 155 70 M 250 95 C 252 110, 255 115, 265 125 C 275 135, 290 145, 290 155 M 250 125 C 245 160, 235 200, 230 240 C 225 270, 228 290, 240 310 C 255 335, 270 330, 275 305 C 280 280, 275 260, 268 240 C 260 215, 255 190, 250 160 M 240 310 C 235 350, 230 400, 235 450 C 238 480, 240 510, 235 560 C 232 590, 228 630, 225 680 C 223 710, 220 730, 218 750 M 275 305 C 278 345, 280 390, 278 440 C 276 470, 275 500, 278 550 C 280 580, 282 620, 283 670 C 284 700, 285 730, 286 750';

// Guide lines — proportional reference lines (horizontal)
const GUIDE_LINES = [
  'M 160 95 L 340 95',    // shoulder line
  'M 180 240 L 320 240',  // waist line
  'M 170 310 L 330 310',  // hip line
  'M 180 450 L 320 450',  // mid-thigh
  'M 175 680 L 325 680',  // knee line
];

// Vertical center line
const CENTER_LINE = 'M 250 55 L 250 755';

const FEATURES = [
  'Mini BBL — proportional, athletic results',
  '360° Liposuction — sculpted definition',
  'Body feminization — balanced, natural curves',
];

export default function NaturalHarmonyHero({ locale, dict }: NaturalHarmonyHeroProps) {
  const { gsapReady } = useGsap();

  const sectionRef = useRef<HTMLElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const mainPathRef = useRef<SVGPathElement>(null);
  const guideRefs = useRef<(SVGPathElement | null)[]>([]);
  const centerLineRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<SVGPathElement>(null);

  const hasAnimated = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);

  // ── Magnetic CTA ──
  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    window.gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: 'power3.out' });
  }, []);

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.gsap) return;
    window.gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
  }, []);

  // ── Reduced-motion / fallback ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setContentVisible(true);
      hasAnimated.current = true;
    }
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        setContentVisible(true);
        hasAnimated.current = true;
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // ── Main GSAP orchestration ──
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

    CustomEase.create('cinematicSilk', 'M0,0 C0.08,0.82 0.17,1 0.3,1 0.45,1 0.55,0.98 1,1');
    CustomEase.create('spa', 'M0,0 C0.25,0.46 0.45,0.94 1,1');

    const ctx = gsap.context(() => {

      // ── Entrance: draw the macro curve ──
      const entranceTl = gsap.timeline({ defaults: { ease: 'spa' } });

      // Background warmth
      if (sectionRef.current) {
        entranceTl.fromTo(sectionRef.current,
          { backgroundColor: '#FDFCFA' },
          { backgroundColor: '#F5F0E8', duration: 0.8 },
          0
        );
      }

      // Draw the initial curve
      if (mainPathRef.current && DrawSVGPlugin) {
        gsap.set(mainPathRef.current, { drawSVG: '0%' });
        entranceTl.to(mainPathRef.current, { drawSVG: '100%', duration: 1.8, ease: 'cinematicSilk' }, 0.3);
      }
      if (glowRef.current && DrawSVGPlugin) {
        gsap.set(glowRef.current, { drawSVG: '0%' });
        entranceTl.to(glowRef.current, { drawSVG: '100%', duration: 2, ease: 'cinematicSilk' }, 0.4);
      }

      // Breathing pulse after draw
      if (svgContainerRef.current) {
        entranceTl.fromTo(svgContainerRef.current,
          { scale: 7.5 },
          { scale: 8, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: 1 },
          2.2
        );
      }

      entranceTl.call(() => setContentVisible(true), [], 1.5);

      // ── Scroll-driven zoom-out + morph + content reveal ──
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self: { progress: number }) => {
            const p = self.progress;

            // ═══════════════════════════════
            // 0-20%: Macro curve, gentle breathing
            // ═══════════════════════════════
            if (p <= 0.2) {
              const pp = p / 0.2;
              if (svgContainerRef.current) {
                const breathe = Math.sin(pp * Math.PI * 2) * 0.3;
                gsap.set(svgContainerRef.current, { scale: 8 + breathe });
              }
              // Content hidden
              if (contentRef.current) gsap.set(contentRef.current, { opacity: 0 });
            }

            // ═══════════════════════════════
            // 20-60%: MorphSVG + zoom-out
            // ═══════════════════════════════
            else if (p <= 0.6) {
              const pp = (p - 0.2) / 0.4; // 0→1

              // Zoom out: scale 8 → 1
              if (svgContainerRef.current) {
                const scale = 8 - pp * 7; // 8→1
                gsap.set(svgContainerRef.current, { scale });
              }

              // MorphSVG morphing is handled by the existing ScrollTrigger/tween-based logic;
              // gsap.set with morphSVG is ineffective as MorphSVG requires a tween for scrubbing.

              // Guide lines draw in
              guideRefs.current.forEach((ref, i) => {
                if (ref && DrawSVGPlugin) {
                  const lineStart = 0.2 + i * 0.12;
                  const lineProgress = Math.max(0, Math.min(1, (pp - lineStart) / 0.4));
                  gsap.set(ref, { drawSVG: `0% ${lineProgress * 100}%` });
                }
              });

              // Center line
              if (centerLineRef.current && DrawSVGPlugin) {
                const clProgress = Math.max(0, Math.min(1, (pp - 0.1) / 0.5));
                gsap.set(centerLineRef.current, { drawSVG: `0% ${clProgress * 100}%` });
              }

              // Content starts appearing at end of this phase
              if (contentRef.current) {
                const fadeStart = 0.7;
                const contentOpacity = pp > fadeStart ? (pp - fadeStart) / (1 - fadeStart) : 0;
                gsap.set(contentRef.current, { opacity: contentOpacity });
              }
            }

            // ═══════════════════════════════
            // 60-80%: Content fully reveals
            // ═══════════════════════════════
            else if (p <= 0.8) {
              const pp = (p - 0.6) / 0.2;

              if (svgContainerRef.current) gsap.set(svgContainerRef.current, { scale: 1 });

              if (contentRef.current) gsap.set(contentRef.current, { opacity: 1 });

              // Staggered content elements
              const els = [kickerRef, headlineRef, ruleRef, subRef, featuresRef, ctaRef, trustRef];
              els.forEach((ref, i) => {
                if (ref.current) {
                  const start = i * 0.1;
                  const elProgress = Math.max(0, Math.min(1, (pp - start) / 0.4));
                  gsap.set(ref.current, {
                    opacity: elProgress,
                    y: (1 - elProgress) * 20,
                  });
                }
              });
            }

            // ═══════════════════════════════
            // 80-100%: Hold → fade out
            // ═══════════════════════════════
            else {
              const pp = (p - 0.8) / 0.2;

              if (svgContainerRef.current) gsap.set(svgContainerRef.current, { scale: 1 });

              const fadeOut = pp > 0.5 ? (pp - 0.5) / 0.5 : 0;

              if (contentRef.current) {
                gsap.set(contentRef.current, { opacity: 1 - fadeOut, y: fadeOut * -30 });
              }
              if (svgContainerRef.current) {
                gsap.set(svgContainerRef.current, { opacity: 1 - fadeOut });
              }
            }
          },
        });

        // ── MorphSVG tween (scrubbed by a separate ScrollTrigger) ──
        if (mainPathRef.current && MorphSVGPlugin) {
          gsap.to(mainPathRef.current, {
            morphSVG: { shape: SILHOUETTE, type: 'linear' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=300%',
              scrub: 1.5,
              // The morph happens between 20-50% of scroll
              // We use the full scroll range and the morph just completes early
            },
            ease: 'cinematicSilk',
          });

          // Glow follows the main path morph
          if (glowRef.current) {
            gsap.to(glowRef.current, {
              morphSVG: { shape: SILHOUETTE, type: 'linear' },
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=300%',
                scrub: 1.5,
              },
              ease: 'cinematicSilk',
            });
          }
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '700px', background: '#F5F0E8' }}
      >
        {/* ── Subtle texture ── */}
        <div className="absolute inset-0 nh-grain" style={{ opacity: 0.03 }} />

        {/* ── Warm ambient light ── */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 35% 50%, rgba(196,162,101,0.06) 0%, transparent 55%)',
        }} />

        {/* ── Layout: Split ── */}
        <div className="relative h-full flex flex-col lg:flex-row items-center" style={{ zIndex: 2 }}>

          {/* ── Left: SVG Silhouette ── */}
          <div className="relative lg:w-[55%] h-[50vh] lg:h-full flex items-center justify-center overflow-hidden">
            <div
              ref={svgContainerRef}
              style={{
                transform: 'scale(8)',
                transformOrigin: '50% 65%', // focus on the hip curve area initially
                willChange: 'transform',
              }}
            >
              <svg
                viewBox="100 30 300 750"
                style={{
                  width: 'clamp(280px, 30vw, 420px)',
                  height: 'auto',
                }}
                fill="none"
              >
                {/* SVG filter for glow */}
                <defs>
                  <filter id="nh-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="nh-stroke-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D4C4A8" />
                    <stop offset="30%" stopColor="#C4A265" />
                    <stop offset="60%" stopColor="#B8860B" />
                    <stop offset="100%" stopColor="#C4A265" />
                  </linearGradient>
                  <linearGradient id="nh-guide-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="20%" stopColor="#D4C4A8" />
                    <stop offset="80%" stopColor="#D4C4A8" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>

                {/* Center line (vertical axis) */}
                <path
                  ref={centerLineRef}
                  d={CENTER_LINE}
                  stroke="#D4C4A8"
                  strokeWidth="0.3"
                  strokeDasharray="4 6"
                  opacity="0.3"
                />

                {/* Guide lines (horizontal proportional refs) */}
                {GUIDE_LINES.map((d, i) => (
                  <path
                    key={i}
                    ref={(el) => { guideRefs.current[i] = el; }}
                    d={d}
                    stroke="url(#nh-guide-grad)"
                    strokeWidth="0.4"
                    strokeDasharray="3 5"
                    opacity="0.25"
                  />
                ))}

                {/* Glow layer (behind main stroke) */}
                <path
                  ref={glowRef}
                  d={MACRO_CURVE}
                  stroke="#C4A265"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.12"
                  filter="url(#nh-glow)"
                />

                {/* Main silhouette path */}
                <path
                  ref={mainPathRef}
                  d={MACRO_CURVE}
                  stroke="url(#nh-stroke-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div
            ref={contentRef}
            className="lg:w-[45%] flex flex-col justify-center px-8 lg:px-12 xl:px-16 pb-10 lg:pb-0 opacity-0"
            style={{ zIndex: 3 }}
          >
            {/* Kicker */}
            <div
              ref={kickerRef}
              className="opacity-0"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(9px, 0.65vw, 11px)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#B8860B',
                marginBottom: 'clamp(14px, 2vh, 24px)',
                fontWeight: 500,
              }}
            >
              BBL & Body Contouring
            </div>

            {/* Headline */}
            <div
              ref={headlineRef}
              className="opacity-0"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(36px, 4.5vw, 72px)',
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#2C2620',
                marginBottom: 'clamp(16px, 2vh, 28px)',
              }}
            >
              Natural<br />Harmony
            </div>

            {/* Rule */}
            <div
              ref={ruleRef}
              className="opacity-0"
              style={{
                width: '40px',
                height: '1.5px',
                background: '#B8860B',
                marginBottom: 'clamp(16px, 2vh, 24px)',
                borderRadius: '1px',
              }}
            />

            {/* Subheadline */}
            <p
              ref={subRef}
              className="opacity-0"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(14px, 1.05vw, 17px)',
                lineHeight: 1.7,
                color: '#8C7B6B',
                maxWidth: '380px',
                marginBottom: 'clamp(24px, 3vh, 36px)',
                fontWeight: 300,
              }}
            >
              The art of subtle refinement — enhancing what nature intended, never replacing it.
            </p>

            {/* Features */}
            <div
              ref={featuresRef}
              className="opacity-0"
              style={{ marginBottom: 'clamp(28px, 3.5vh, 40px)' }}
            >
              {FEATURES.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3"
                  style={{
                    padding: '8px 0',
                    borderBottom: i < FEATURES.length - 1 ? '1px solid rgba(196,162,101,0.12)' : 'none',
                  }}
                >
                  <div style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: '#B8860B', flexShrink: 0, marginTop: '8px', opacity: 0.6,
                  }} />
                  <span style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(13px, 0.9vw, 15px)',
                    color: '#6B5D50',
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="opacity-0" style={{ marginBottom: 'clamp(20px, 2.5vh, 32px)' }}>
              <Link
                href={`/${locale}/procedures`}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 30px',
                  background: '#B8860B',
                  color: '#F5F0E8',
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(184,134,11,0.2)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                Explore Body Procedures
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Trust line */}
            <div
              ref={trustRef}
              className="opacity-0"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(10px, 0.7vw, 12px)',
                color: '#A89880',
                letterSpacing: '0.05em',
                fontWeight: 400,
              }}
            >
              Board-certified surgeons · JCI accredited facility
            </div>
          </div>
        </div>

        {/* ── Visibility fallback ── */}
        {!contentVisible && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20, background: '#F5F0E8' }} />
        )}
      </section>

      <style jsx>{`
        .nh-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: multiply;
        }
      `}</style>
    </>
  );
}
