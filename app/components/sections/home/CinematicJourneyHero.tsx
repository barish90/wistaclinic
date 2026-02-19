'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface CinematicJourneyHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ── Service cards data ── */
const SERVICES = [
  {
    title: 'BBL & Body',
    desc: 'Brazilian Butt Lift, liposuction, and body contouring performed by board-certified surgeons with natural, proportional results.',
    accent: '#B8860B',
    size: 'large',
  },
  {
    title: 'Hair Restoration',
    desc: 'Advanced FUE & DHI transplants with micro-precision graft placement for seamless, permanent density.',
    accent: '#F5E1A4',
    size: 'small',
  },
  {
    title: 'Facial Aesthetics',
    desc: 'Rhinoplasty, facelifts, and non-surgical rejuvenation tailored to each patient\'s unique facial architecture.',
    accent: '#FFF8E7',
    size: 'small',
  },
];

const TRUST_SIGNALS = [
  { label: 'JCI Accredited', value: 'JCI' },
  { label: '15+ Years', value: '15+' },
  { label: '10,000+ Patients', value: '10K+' },
  { label: '98% Satisfaction', value: '98%' },
];

const PRESS = ['Forbes Health', 'Medical Tourism Mag', 'Vogue Turkey', 'Harper\'s Bazaar'];

export default function CinematicJourneyHero({ locale, dict }: CinematicJourneyHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  // Refs
  const sectionRef = useRef<HTMLElement>(null);
  // Phase 1
  const marbleRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const phase1ContentRef = useRef<HTMLDivElement>(null);
  // Phase 2
  const phase2Ref = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const geomRef = useRef<HTMLDivElement>(null);
  // Phase 3
  const phase3Ref = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);
  const quickToX = useRef<((v: number) => void) | null>(null);
  const quickToY = useRef<((v: number) => void) | null>(null);

  // ── Magnetic CTA with quickTo ──
  const handleCtaMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (quickToX.current && quickToY.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      quickToX.current(x * 0.3);
      quickToY.current(y * 0.3);
    }
  }, []);

  const handleCtaLeave = useCallback(() => {
    if (quickToX.current && quickToY.current) {
      quickToX.current(0);
      quickToY.current(0);
    }
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
    const DrawSVGPlugin = window.DrawSVGPlugin;
    if (!gsap || !ScrollTrigger || !SplitText || !CustomEase) return;

    hasAnimated.current = true;
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);

    CustomEase.create('cinematic', 'M0,0 C0.12,0.72 0.28,1 1,1');

    // Setup quickTo for magnetic CTA
    if (ctaBtnRef.current) {
      quickToX.current = gsap.quickTo(ctaBtnRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
      quickToY.current = gsap.quickTo(ctaBtnRef.current, 'y', { duration: 0.4, ease: 'power3.out' });
    }

    const ctx = gsap.context(() => {
      // ── Entrance animation (before scroll) ──
      const entranceTl = gsap.timeline({ defaults: { ease: 'cinematic' } });

      // Wordmark fades in
      entranceTl.fromTo(wordmarkRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 },
        0.3
      );

      // Headline with SplitText stagger
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: 'words,lines', linesClass: 'cj-line' });
        entranceTl.fromTo(split.words,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'cinematic' },
          1.0
        );
      }

      entranceTl.call(() => setContentVisible(true), [], 1.0);

      // ── Scroll-driven phases ──
      // Cache DOM queries outside the scroll callback for performance
      const cachedCardEls = cardsRef.current?.querySelectorAll('.cj-card');
      const cachedTrustEls = trustRef.current?.querySelectorAll('.cj-trust');

      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self: { progress: number }) => {
            const p = self.progress;

            // ═══════════════════════════════════════
            // PHASE 1: THE MACRO REVEAL (0% - 30%)
            // ═══════════════════════════════════════
            if (p <= 0.3) {
              const pp = p / 0.3; // 0→1 within phase

              // Marble zooms in
              if (marbleRef.current) {
                gsap.set(marbleRef.current, {
                  scale: 1 + pp * 0.15,
                  opacity: 1,
                });
              }

              // Phase 1 content fades/rises as we approach transition
              if (phase1ContentRef.current) {
                const fadeStart = 0.6; // start fading at 60% of phase 1
                const fadeProgress = pp > fadeStart ? (pp - fadeStart) / (1 - fadeStart) : 0;
                gsap.set(phase1ContentRef.current, {
                  y: fadeProgress * -80,
                  opacity: 1 - fadeProgress,
                });
              }

              // Phase 2 hidden
              if (phase2Ref.current) gsap.set(phase2Ref.current, { opacity: 0 });
              if (phase3Ref.current) gsap.set(phase3Ref.current, { opacity: 0 });
            }

            // ═══════════════════════════════════════
            // PHASE 2: THE 3D TRANSFORMATION (30% - 70%)
            // ═══════════════════════════════════════
            else if (p <= 0.7) {
              const pp = (p - 0.3) / 0.4; // 0→1 within phase

              // Hide phase 1
              if (phase1ContentRef.current) gsap.set(phase1ContentRef.current, { opacity: 0 });
              if (marbleRef.current) gsap.set(marbleRef.current, { opacity: Math.max(0, 1 - pp * 3) });

              // Show phase 2
              if (phase2Ref.current) {
                const fadeIn = Math.min(1, pp * 4);
                const fadeOut = pp > 0.85 ? (pp - 0.85) / 0.15 : 0;
                gsap.set(phase2Ref.current, { opacity: fadeIn * (1 - fadeOut) });
              }

              // Camera pushes forward through Z-space
              if (sceneRef.current) {
                const z = -800 + pp * 1000;
                gsap.set(sceneRef.current, {
                  transform: `translateZ(${z}px) rotateY(${pp * 5}deg)`,
                });
              }

              // Geometric shapes rotate
              if (geomRef.current) {
                gsap.set(geomRef.current, {
                  transform: `rotateX(${pp * 30}deg) rotateY(${pp * 60}deg) rotateZ(${pp * 15}deg)`,
                });
              }

              // Service cards emerge with stagger
              if (cachedCardEls) {
                cachedCardEls.forEach((card, i) => {
                  const cardStart = 0.15 + i * 0.15;
                  const cardProgress = Math.max(0, Math.min(1, (pp - cardStart) / 0.35));
                  gsap.set(card, {
                    opacity: cardProgress,
                    y: (1 - cardProgress) * 60,
                    scale: 0.9 + cardProgress * 0.1,
                  });
                });
              }

              // DrawSVG line
              if (svgPathRef.current && DrawSVGPlugin) {
                const drawProgress = Math.max(0, Math.min(100, pp * 130));
                gsap.set(svgPathRef.current, { drawSVG: `0% ${drawProgress}%` });
              } else if (svgPathRef.current) {
                // Fallback when DrawSVGPlugin is not available
                const drawProgress = Math.max(0, Math.min(100, pp * 130));
                svgPathRef.current.style.strokeDashoffset = String(2000 - (drawProgress / 100) * 2000);
              }

              // Phase 3 hidden
              if (phase3Ref.current) gsap.set(phase3Ref.current, { opacity: 0 });
            }

            // ═══════════════════════════════════════
            // PHASE 3: THE CLINICAL AUTHORITY (70% - 100%)
            // ═══════════════════════════════════════
            else {
              const pp = (p - 0.7) / 0.3; // 0→1 within phase

              // Hide phases 1 & 2
              if (phase1ContentRef.current) gsap.set(phase1ContentRef.current, { opacity: 0 });
              if (marbleRef.current) gsap.set(marbleRef.current, { opacity: 0 });
              if (phase2Ref.current) gsap.set(phase2Ref.current, { opacity: Math.max(0, 1 - pp * 5) });

              // Show phase 3
              if (phase3Ref.current) {
                gsap.set(phase3Ref.current, { opacity: Math.min(1, pp * 3) });
              }

              // Trust signals slide in with parallax stagger
              if (cachedTrustEls) {
                cachedTrustEls.forEach((el, i) => {
                  const start = 0.05 + i * 0.08;
                  const prog = Math.max(0, Math.min(1, (pp - start) / 0.3));
                  gsap.set(el, {
                    opacity: prog,
                    x: (1 - prog) * (i % 2 === 0 ? -40 : 40),
                    y: (1 - prog) * 20,
                  });
                });
              }

              // Press logos
              if (pressRef.current) {
                const pressProgress = Math.max(0, Math.min(1, (pp - 0.3) / 0.3));
                gsap.set(pressRef.current, { opacity: pressProgress, y: (1 - pressProgress) * 15 });
              }

              // CTA + tagline
              if (ctaBtnRef.current) {
                const ctaProgress = Math.max(0, Math.min(1, (pp - 0.45) / 0.25));
                gsap.set(ctaBtnRef.current, { opacity: ctaProgress, scale: 0.95 + ctaProgress * 0.05 });
              }
              if (taglineRef.current) {
                const tagProgress = Math.max(0, Math.min(1, (pp - 0.55) / 0.25));
                gsap.set(taglineRef.current, { opacity: tagProgress });
              }
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '700px', background: '#0E0B08' }}
      >
        {/* ══════════════════════════════════════════
            PHASE 1: THE MACRO REVEAL
            ══════════════════════════════════════════ */}

        {/* Marble texture background */}
        <div
          ref={marbleRef}
          className="absolute inset-0 cj-marble"
          style={{ zIndex: 1, transformOrigin: 'center center' }}
        />

        {/* Phase 1 content */}
        <div
          ref={phase1ContentRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ zIndex: 5 }}
        >
          {/* Wordmark */}
          <div ref={wordmarkRef} className="opacity-0" style={{ marginBottom: 'clamp(24px, 3vh, 40px)' }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(14px, 1.2vw, 20px)',
              fontWeight: 300,
              letterSpacing: '0.6em',
              textTransform: 'uppercase',
              color: '#B8860B',
            }}>
              WISTA
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(9px, 0.65vw, 11px)',
              fontWeight: 400,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(184,134,11,0.5)',
              marginTop: '4px',
            }}>
              CLINIC
            </div>
          </div>

          {/* Main headline */}
          <div
            ref={headlineRef}
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(38px, 5.5vw, 90px)',
              fontWeight: 300,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#F5E1A4',
              maxWidth: '800px',
              padding: '0 24px',
            }}
          >
            The Art of the Natural Self
          </div>

          {/* Scroll prompt */}
          <div style={{
            position: 'absolute',
            bottom: 'clamp(30px, 5vh, 60px)',
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(184,134,11,0.35)',
          }}>
            Scroll to explore
          </div>
        </div>

        {/* ══════════════════════════════════════════
            PHASE 2: THE 3D TRANSFORMATION
            ══════════════════════════════════════════ */}
        <div
          ref={phase2Ref}
          className="absolute inset-0 flex items-center justify-center opacity-0"
          style={{ zIndex: 6, perspective: '1200px' }}
        >
          {/* 3D Scene container */}
          <div
            ref={sceneRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-800px)' }}
          >
            {/* Abstract geometric shapes */}
            <div
              ref={geomRef}
              className="absolute"
              style={{
                width: '300px', height: '300px',
                transformStyle: 'preserve-3d',
                opacity: 0.06,
              }}
            >
              {/* Hexagonal form */}
              <div className="absolute inset-0" style={{
                border: '1px solid rgba(184,134,11,0.3)',
                borderRadius: '50%',
                transform: 'rotateX(60deg) translateZ(100px)',
              }} />
              <div className="absolute inset-0" style={{
                border: '1px solid rgba(245,225,164,0.2)',
                borderRadius: '30%',
                transform: 'rotateY(45deg) translateZ(-50px)',
                width: '200px', height: '200px', margin: 'auto',
              }} />
              <div className="absolute" style={{
                width: '150px', height: '150px',
                border: '1px solid rgba(184,134,11,0.15)',
                transform: 'rotateZ(30deg) rotateX(45deg) translateZ(80px)',
                top: '50%', left: '50%', marginTop: '-75px', marginLeft: '-75px',
              }} />
            </div>

            {/* DrawSVG connecting path */}
            <svg
              className="absolute"
              style={{ width: '80%', height: '60%', top: '20%', left: '10%', zIndex: 2 }}
              viewBox="0 0 800 400"
              fill="none"
            >
              <path
                ref={svgPathRef}
                d="M 50 200 C 150 100, 250 300, 350 180 S 550 50, 650 200 S 750 350, 780 200"
                stroke="rgba(184,134,11,0.2)"
                strokeWidth="1"
                fill="none"
                style={{ strokeDasharray: '2000', strokeDashoffset: '2000' }}
              />
            </svg>

            {/* Bento service cards */}
            <div
              ref={cardsRef}
              className="relative w-full max-w-[900px] px-6"
              style={{ zIndex: 3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
                {/* Large card — left */}
                <div
                  className="cj-card lg:col-span-3 opacity-0"
                  style={{
                    background: 'rgba(184,134,11,0.04)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: `1px solid rgba(184,134,11,0.12)`,
                    borderRadius: '14px',
                    padding: 'clamp(24px, 2.5vw, 36px)',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{
                    width: '28px', height: '2px',
                    background: SERVICES[0].accent, marginBottom: '16px', borderRadius: '1px',
                  }} />
                  <h3 style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(22px, 1.8vw, 30px)', fontWeight: 400,
                    color: '#F5E1A4', marginBottom: '10px', letterSpacing: '-0.01em',
                  }}>
                    {SERVICES[0].title}
                  </h3>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(13px, 0.9vw, 15px)', lineHeight: 1.65,
                    color: 'rgba(245,225,164,0.5)', fontWeight: 300,
                  }}>
                    {SERVICES[0].desc}
                  </p>
                </div>

                {/* Two stacked cards — right */}
                <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-5">
                  {SERVICES.slice(1).map((svc, i) => (
                    <div
                      key={i}
                      className="cj-card opacity-0"
                      style={{
                        background: 'rgba(184,134,11,0.03)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        border: '1px solid rgba(184,134,11,0.09)',
                        borderRadius: '14px',
                        padding: 'clamp(20px, 2vw, 28px)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <div style={{
                        width: '22px', height: '2px',
                        background: svc.accent, marginBottom: '12px', borderRadius: '1px', opacity: 0.6,
                      }} />
                      <h3 style={{
                        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(18px, 1.4vw, 24px)', fontWeight: 400,
                        color: '#F5E1A4', marginBottom: '8px',
                      }}>
                        {svc.title}
                      </h3>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(12px, 0.8vw, 14px)', lineHeight: 1.6,
                        color: 'rgba(245,225,164,0.45)', fontWeight: 300,
                      }}>
                        {svc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            PHASE 3: THE CLINICAL AUTHORITY
            ══════════════════════════════════════════ */}
        <div
          ref={phase3Ref}
          className="absolute inset-0 flex flex-col items-center justify-center text-center opacity-0 px-6"
          style={{ zIndex: 7 }}
        >
          {/* Warm clinic environment background */}
          <div className="absolute inset-0 cj-clinic-bg" />

          {/* Trust signals */}
          <div
            ref={trustRef}
            className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-14 w-full max-w-[800px]"
            style={{ zIndex: 2 }}
          >
            {TRUST_SIGNALS.map((signal, i) => (
              <div
                key={i}
                className="cj-trust opacity-0"
                style={{
                  background: 'rgba(184,134,11,0.06)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(184,134,11,0.1)',
                  borderRadius: '12px',
                  padding: 'clamp(16px, 1.5vw, 24px)',
                }}
              >
                <div style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(28px, 2.5vw, 42px)',
                  fontWeight: 300,
                  color: '#B8860B',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}>
                  {signal.value}
                </div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(10px, 0.7vw, 12px)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,225,164,0.5)',
                  fontWeight: 400,
                }}>
                  {signal.label}
                </div>
              </div>
            ))}
          </div>

          {/* As Seen In */}
          <div
            ref={pressRef}
            className="relative opacity-0 mb-10 lg:mb-14"
            style={{ zIndex: 2 }}
          >
            <div style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: '9px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(140,128,112,0.5)',
              marginBottom: '16px',
            }}>
              As Seen In
            </div>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
              {PRESS.map((name, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(12px, 0.9vw, 15px)',
                    color: 'rgba(184,134,11,0.35)',
                    fontWeight: 400,
                    letterSpacing: '0.08em',
                    fontStyle: 'italic',
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Primary CTA — magnetic */}
          <Link
            href={`/${locale}/contact`}
            ref={ctaBtnRef}
            onMouseMove={handleCtaMove}
            onMouseLeave={handleCtaLeave}
            className="relative opacity-0"
            style={{
              zIndex: 2,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 44px',
              background: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #8B6508 100%)',
              color: '#0E0B08',
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(14px, 1vw, 17px)',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 6px 30px rgba(184,134,11,0.3), 0 0 80px rgba(184,134,11,0.08)',
              marginBottom: '20px',
              willChange: 'transform',
            }}
          >
            Book Your Consult
            <ArrowRight size={17} />
          </Link>

          {/* Final tagline */}
          <div
            ref={taglineRef}
            className="relative opacity-0"
            style={{
              zIndex: 2,
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(12px, 0.85vw, 14px)',
              color: 'rgba(140,128,112,0.45)',
              fontWeight: 300,
              letterSpacing: '0.05em',
              fontStyle: 'italic',
            }}
          >
            Your transformation begins with a conversation.
          </div>
        </div>

        {/* ── Film Grain (all phases) ── */}
        <div className="absolute inset-0 pointer-events-none cj-grain" style={{ zIndex: 8, opacity: 0.04 }} />

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 9, background: 'radial-gradient(ellipse at center, transparent 55%, rgba(14,11,8,0.6) 100%)' }}
        />

        {/* ── Visibility fallback ── */}
        {!contentVisible && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20, background: '#0E0B08' }} />
        )}
      </section>

      <style jsx>{`
        /* ── Phase 1: Dark marble texture ── */
        .cj-marble {
          background:
            /* Gold veining — thin diagonal lines */
            repeating-linear-gradient(
              125deg,
              transparent 0px,
              transparent 80px,
              rgba(184,134,11,0.03) 80px,
              rgba(184,134,11,0.06) 82px,
              transparent 82px,
              transparent 200px
            ),
            repeating-linear-gradient(
              65deg,
              transparent 0px,
              transparent 120px,
              rgba(212,175,55,0.02) 120px,
              rgba(212,175,55,0.04) 121px,
              transparent 121px,
              transparent 280px
            ),
            /* Warm ambient pools */
            radial-gradient(ellipse at 30% 40%, rgba(139,90,43,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(184,134,11,0.05) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 80%, rgba(100,70,30,0.06) 0%, transparent 40%),
            /* Marble variation */
            radial-gradient(ellipse at 20% 70%, rgba(30,25,18,0.9) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 30%, rgba(25,20,15,0.8) 0%, transparent 55%),
            /* Base */
            linear-gradient(160deg, #0E0B08 0%, #1A1510 40%, #0E0B08 100%);
        }

        /* ── Phase 3: Warm clinic environment ── */
        .cj-clinic-bg {
          background:
            radial-gradient(ellipse at 50% 40%, rgba(184,134,11,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 30% 70%, rgba(139,90,43,0.04) 0%, transparent 45%),
            radial-gradient(ellipse at 70% 30%, rgba(245,225,164,0.03) 0%, transparent 40%),
            linear-gradient(180deg, #0E0B08 0%, #15120D 50%, #0E0B08 100%);
        }

        /* ── Film grain ── */
        .cj-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: overlay;
        }

        /* ── SplitText line overflow ── */
        :global(.cj-line) {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
