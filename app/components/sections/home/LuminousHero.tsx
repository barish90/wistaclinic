'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface LuminousHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ── Service data per curtain layer ── */
const SERVICES = [
  {
    keyword: 'Artistry',
    title: 'Hair Restoration',
    desc: 'Advanced FUE & DHI transplants with micro-precision graft placement for seamless, permanent density.',
    entrance: 'stretchX',
  },
  {
    keyword: 'Precision',
    title: 'Breast Augmentation',
    desc: 'Natural-looking breast enhancement tailored to your body proportions with the latest surgical techniques.',
    entrance: 'rotateY',
  },
  {
    keyword: 'Natural',
    title: 'BBL & Body Contouring',
    desc: 'Brazilian Butt Lift and body sculpting for harmonious, proportional results by board-certified surgeons.',
    entrance: 'dropY',
  },
];

const TRUST_SIGNALS = [
  { label: 'JCI Accredited' },
  { label: '15+ Years Experience' },
  { label: '10,000+ Transformations' },
  { label: '98% Satisfaction' },
];

export default function LuminousHero({ locale, dict }: LuminousHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  /* ── Refs ── */
  const sectionRef = useRef<HTMLElement>(null);
  const curtainRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lightBleedRefs = useRef<(HTMLDivElement | null)[]>([]);
  const keywordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const frontCurtainRef = useRef<HTMLDivElement>(null);
  const finalSpaceRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stickyBtnRef = useRef<HTMLAnchorElement>(null);
  const cursorLightRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);

  /* ── Cursor light ── */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!cursorLightRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cursorLightRef.current.style.left = `${x}px`;
    cursorLightRef.current.style.top = `${y}px`;
    cursorLightRef.current.style.opacity = '1';
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cursorLightRef.current) cursorLightRef.current.style.opacity = '0';
  }, []);

  /* ── Magnetic sticky button ── */
  const handleStickyMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  }, []);

  const handleStickyLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'translate(0,0)';
  }, []);

  /* ── GSAP scroll animation ── */
  useEffect(() => {
    if (!gsapReady || hasAnimated.current) return;

    const gsap = (window as unknown as { gsap: any }).gsap;
    const ScrollTrigger = (window as unknown as { ScrollTrigger: any }).ScrollTrigger;
    const CustomEase = (window as unknown as { CustomEase: any }).CustomEase;

    if (!gsap || !ScrollTrigger || !sectionRef.current) return;
    hasAnimated.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setContentVisible(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (CustomEase) {
      gsap.registerPlugin(CustomEase);
      CustomEase.create('silky', 'M0,0 C0.14,0 0.27,0.56 0.38,0.76 0.48,0.92 0.62,1 1,1');
    }

    setContentVisible(true);

    const section = sectionRef.current;
    const silkyEase = CustomEase ? 'silky' : 'power3.inOut';

    /* ── Master pinned timeline ── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=500%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    /* ── Phase 0 (0–0.08): Wordmark entrance on load, fades on scroll ── */
    gsap.fromTo(
      wordmarkRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 }
    );
    gsap.fromTo(
      scrollHintRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, delay: 1 }
    );

    // Fade wordmark + hint as scroll starts
    tl.to(scrollHintRef.current, { opacity: 0, duration: 0.03 }, 0);
    tl.to(wordmarkRef.current, { opacity: 0, y: -50, duration: 0.05 }, 0.01);

    /* ────────────────────────────────────────────
       HELPER: Part a curtain (left/right slide out)
       ──────────────────────────────────────────── */
    const partCurtain = (ref: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null, startPos: number, dur: number) => {
      const el = ref && 'current' in ref ? ref.current : ref;
      if (!el) return;
      const left = el.querySelector('.curtain-left') as HTMLElement;
      const right = el.querySelector('.curtain-right') as HTMLElement;
      if (left) tl.to(left, { xPercent: -105, duration: dur, ease: silkyEase }, startPos);
      if (right) tl.to(right, { xPercent: 105, duration: dur, ease: silkyEase }, startPos);
    };

    /* ────────────────────────────────────────────
       HELPER: Animate keyword entrance
       ──────────────────────────────────────────── */
    const animateKeyword = (index: number, startPos: number) => {
      const kw = keywordRefs.current[index];
      const card = cardRefs.current[index];
      const entrance = SERVICES[index].entrance;

      if (kw) {
        if (entrance === 'stretchX') {
          tl.fromTo(kw,
            { opacity: 0, scaleX: 0.3, letterSpacing: '-0.08em' },
            { opacity: 1, scaleX: 1, letterSpacing: '0.08em', duration: 0.10, ease: silkyEase },
            startPos
          );
        } else if (entrance === 'rotateY') {
          tl.fromTo(kw,
            { opacity: 0, rotateY: -90 },
            { opacity: 1, rotateY: 0, duration: 0.10, ease: silkyEase },
            startPos
          );
        } else if (entrance === 'dropY') {
          tl.fromTo(kw,
            { opacity: 0, yPercent: -120 },
            { opacity: 1, yPercent: 0, duration: 0.10, ease: 'back.out(1.4)' },
            startPos
          );
        }
      }

      if (card) {
        tl.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
          startPos + 0.06
        );
      }
    };

    /* ────────────────────────────────────────────
       HELPER: Fade out previous keyword + card
       ──────────────────────────────────────────── */
    const fadeContent = (index: number, startPos: number) => {
      const kw = keywordRefs.current[index];
      const card = cardRefs.current[index];
      if (kw) tl.to(kw, { opacity: 0, scale: 0.85, duration: 0.05 }, startPos);
      if (card) tl.to(card, { opacity: 0, y: -30, duration: 0.05 }, startPos);
    };

    /* ────────────────────────────────────────────
       HELPER: Light bleed pulse
       ──────────────────────────────────────────── */
    const lightBleed = (index: number, startPos: number) => {
      const lb = lightBleedRefs.current[index];
      if (!lb) return;
      tl.fromTo(lb,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.8, scale: 1.3, duration: 0.08, ease: 'power2.out' },
        startPos
      );
      tl.to(lb, { opacity: 0, duration: 0.08 }, startPos + 0.10);
    };

    /* ══════════════════════════════════════════
       PHASE 1 (0.04 – 0.28): Front curtain parts → Artistry + Hair
       ══════════════════════════════════════════ */
    partCurtain(frontCurtainRef, 0.04, 0.14);
    lightBleed(0, 0.06);
    animateKeyword(0, 0.12);
    // Hold: keyword visible from 0.12 to 0.26

    /* ══════════════════════════════════════════
       PHASE 2 (0.28 – 0.52): Curtain 0 parts → Precision + Breast
       ══════════════════════════════════════════ */
    fadeContent(0, 0.26);
    partCurtain(curtainRefs.current[0], 0.28, 0.14);
    lightBleed(1, 0.30);
    animateKeyword(1, 0.36);
    // Hold: keyword visible from 0.36 to 0.50

    /* ══════════════════════════════════════════
       PHASE 3 (0.52 – 0.76): Curtain 1 parts → Natural + Body
       ══════════════════════════════════════════ */
    fadeContent(1, 0.50);
    partCurtain(curtainRefs.current[1], 0.52, 0.14);
    lightBleed(2, 0.54);
    animateKeyword(2, 0.60);
    // Hold: keyword visible from 0.60 to 0.74

    /* ══════════════════════════════════════════
       PHASE 4 (0.76 – 1.0): Final curtain parts → CTA reveal
       ══════════════════════════════════════════ */
    fadeContent(2, 0.74);
    partCurtain(curtainRefs.current[2], 0.76, 0.14);

    // Final cream space fades in
    if (finalSpaceRef.current) {
      tl.fromTo(finalSpaceRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.08, ease: 'power2.out' },
        0.82
      );
    }

    // CTA block entrance
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: 'back.out(1.2)' },
        0.86
      );
    }

    /* ── Sticky button glow tied to scroll velocity ── */
    let lastScroll = 0;
    const glowST = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=500%',
      onUpdate: (self: { scroll: () => number }) => {
        const vel = Math.abs(self.scroll() - lastScroll);
        lastScroll = self.scroll();
        if (stickyBtnRef.current) {
          const glow = Math.min(vel * 0.5, 25);
          stickyBtnRef.current.style.boxShadow = `0 0 ${glow}px ${glow * 0.4}px rgba(184,134,11,${0.3 + glow * 0.02})`;
        }
      },
    });

    const fallback = setTimeout(() => setContentVisible(true), 5000);

    return () => {
      clearTimeout(fallback);
      glowST.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [gsapReady]);

  /*
   * Curtain layer configs — SOLID opaque backgrounds
   * Each layer must be dark enough to provide contrast for champagne (#F5E1A4) text
   * They go from dark (frontmost/first to part) to medium (last to part before cream CTA)
   */
  const CURTAIN_LAYERS = [
    { bg: '#6B6358', sheen: 'rgba(255,248,231,0.06)' }, // Layer 4 — dark warm gray
    { bg: '#7A7064', sheen: 'rgba(255,248,231,0.08)' }, // Layer 3 — warm gray
    { bg: '#8A7D6A', sheen: 'rgba(255,248,231,0.10)' }, // Layer 2 — medium warm
  ];

  return (
    <section
      ref={sectionRef}
      className="luminous-hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ visibility: contentVisible ? 'visible' : 'hidden' }}
    >
      {/* ── Base: warm cream final space (bottommost) ── */}
      <div className="luminous-base">
        <div ref={finalSpaceRef} className="luminous-final-space" style={{ opacity: 0 }}>
          <div className="luminous-badges">
            {SERVICES.map((s, i) => (
              <span key={i} className="luminous-badge">{s.title}</span>
            ))}
          </div>
          <div ref={ctaRef} className="luminous-cta-block" style={{ opacity: 0 }}>
            <h2 className="luminous-cta-headline">Begin Your Transformation</h2>
            <p className="luminous-cta-tagline">From consultation to confidence</p>
            <Link href={`/${locale}/contact`} className="luminous-cta-button">
              {hero.ctaPrimary || 'Book Your Consultation'}
              <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Link>
            <div className="luminous-trust">
              {TRUST_SIGNALS.map((t, i) => (
                <span key={i} className="luminous-trust-item">{t.label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Curtain layers (3 layers, dark → medium)
            Z-index scheme (interleaved with service overlays):
            Front curtain: 20
            Service 0 (Artistry): 17  ← between front & curtain 0
            Curtain 0: 15
            Service 1 (Precision): 13  ← between curtain 0 & 1
            Curtain 1: 11
            Service 2 (Natural): 9   ← between curtain 1 & 2
            Curtain 2: 7
            Base (CTA): 5
      ── */}
      {CURTAIN_LAYERS.map((layer, idx) => {
        const curtainZ = 15 - (idx * 4); // 15, 11, 7
        return (
        <div
          key={idx}
          ref={(el) => { curtainRefs.current[idx] = el; }}
          className="luminous-curtain-layer"
          style={{ zIndex: curtainZ }}
        >
          <div
            className="curtain-left luminous-curtain-half"
            style={{
              background: `
                linear-gradient(105deg, ${layer.bg} 0%, ${layer.bg} 60%, ${layer.bg} 100%),
                linear-gradient(175deg, ${layer.sheen} 0%, transparent 50%)
              `,
            }}
          >
            <div className="curtain-seam curtain-seam-right" />
            <div className="curtain-edge curtain-edge-right" />
          </div>
          <div
            className="curtain-right luminous-curtain-half"
            style={{
              background: `
                linear-gradient(-105deg, ${layer.bg} 0%, ${layer.bg} 60%, ${layer.bg} 100%),
                linear-gradient(-175deg, ${layer.sheen} 0%, transparent 50%)
              `,
            }}
          >
            <div className="curtain-seam curtain-seam-left" />
            <div className="curtain-edge curtain-edge-left" />
          </div>
          {/* Light bleed between layers */}
          <div
            ref={(el) => { lightBleedRefs.current[idx] = el; }}
            className="luminous-light-bleed"
            style={{ opacity: 0 }}
          />
        </div>
        );
      })}

      {/* ── Service keyword + card overlays ── */}
      {SERVICES.map((service, idx) => {
        const serviceZ = 17 - (idx * 4); // 17, 13, 9
        return (
        <div
          key={idx}
          className="luminous-service-overlay"
          style={{ zIndex: serviceZ }}
        >
          <div
            ref={(el) => { keywordRefs.current[idx] = el; }}
            className="luminous-keyword"
            style={{
              opacity: 0,
              perspective: service.entrance === 'rotateY' ? '800px' : undefined,
              transformStyle: service.entrance === 'rotateY' ? 'preserve-3d' : undefined,
            }}
          >
            {service.keyword}
          </div>
          <div
            ref={(el) => { cardRefs.current[idx] = el; }}
            className="luminous-service-card"
            style={{ opacity: 0 }}
          >
            <div className="luminous-card-accent" />
            <h3 className="luminous-card-title">{service.title}</h3>
            <p className="luminous-card-desc">{service.desc}</p>
          </div>
        </div>
        );
      })}

      {/* ── Frontmost curtain (Layer 5) — darkest, with wordmark ── */}
      <div ref={frontCurtainRef} className="luminous-front-curtain" style={{ zIndex: 20 }}>
        <div className="curtain-left luminous-curtain-half luminous-front-half" />
        <div className="curtain-right luminous-curtain-half luminous-front-half-right" />
        <div className="luminous-front-seam" />
        <div ref={wordmarkRef} className="luminous-wordmark" style={{ opacity: 0 }}>
          <span className="luminous-wordmark-top">WISTA</span>
          <span className="luminous-wordmark-bottom">CLINIC</span>
        </div>
        <div ref={scrollHintRef} className="luminous-scroll-hint" style={{ opacity: 0 }}>
          <div className="luminous-scroll-line" />
          <span>{hero.scrollHint || 'Scroll to begin'}</span>
        </div>
        <div className="luminous-shimmer" />
      </div>

      {/* ── Cursor light effect ── */}
      <div
        ref={cursorLightRef}
        className="luminous-cursor-light"
        style={{ opacity: 0 }}
      />

      {/* ── Sticky Book Now ── */}
      <Link
        ref={stickyBtnRef}
        href={`/${locale}/contact`}
        className="luminous-sticky-btn"
        onMouseMove={handleStickyMove}
        onMouseLeave={handleStickyLeave}
      >
        Book Now
        <ArrowRight size={14} style={{ marginLeft: 6 }} />
      </Link>

      <style jsx>{`
        .luminous-hero {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #5C5549;
          font-family: 'Cormorant Garamond', 'Georgia', serif;
        }

        /* ── Final space (cream, bottommost) ── */
        .luminous-base {
          position: absolute;
          inset: 0;
          z-index: 5;
          background: #FFF8E7;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .luminous-final-space {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          gap: 1.5rem;
        }
        .luminous-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .luminous-badge {
          padding: 0.4em 1em;
          border: 1px solid rgba(184,134,11,0.3);
          border-radius: 999px;
          font-size: clamp(11px, 1.2vw, 14px);
          color: #8C8070;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .luminous-cta-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .luminous-cta-headline {
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 300;
          color: #2C2620;
          letter-spacing: 0.02em;
          line-height: 1.1;
          margin: 0;
        }
        .luminous-cta-tagline {
          font-size: clamp(14px, 1.5vw, 18px);
          color: #8C8070;
          font-style: italic;
          font-weight: 300;
          margin: 0;
        }
        .luminous-cta-button {
          display: inline-flex;
          align-items: center;
          padding: 1em 2.5em;
          background: #B8860B;
          color: #FFF8E7;
          border-radius: 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(14px, 1.4vw, 18px);
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.3s ease, transform 0.3s ease;
          margin-top: 0.5rem;
        }
        .luminous-cta-button:hover {
          background: #D4AF37;
          transform: translateY(-2px);
        }
        .luminous-trust {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 1.5rem;
        }
        .luminous-trust-item {
          font-size: clamp(10px, 1.1vw, 13px);
          color: #8C8070;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          position: relative;
          padding-left: 1em;
        }
        .luminous-trust-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #B8860B;
        }

        /* ── Curtain layers ── */
        .luminous-curtain-layer {
          position: absolute;
          inset: 0;
          display: flex;
          pointer-events: none;
        }
        .luminous-curtain-half {
          width: 50%;
          height: 100%;
          position: relative;
          will-change: transform;
        }

        /* ── Front curtain (darkest, solid) ── */
        .luminous-front-curtain {
          position: absolute;
          inset: 0;
          display: flex;
          pointer-events: none;
        }
        .luminous-front-half {
          background: linear-gradient(105deg, #4E4840 0%, #5A524A 40%, #4E4840 100%);
        }
        .luminous-front-half-right {
          background: linear-gradient(-105deg, #4E4840 0%, #5A524A 40%, #4E4840 100%);
        }

        /* Center seam on front curtain */
        .luminous-front-seam {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          z-index: 22;
          background: linear-gradient(180deg,
            transparent 5%,
            rgba(245,225,164,0.25) 20%,
            rgba(245,225,164,0.4) 50%,
            rgba(245,225,164,0.25) 80%,
            transparent 95%
          );
          box-shadow: 0 0 8px 1px rgba(245,225,164,0.15);
        }

        /* Seam lines on inner curtain edges */
        .curtain-seam {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(245,225,164,0.12);
        }
        .curtain-seam-right { right: 0; }
        .curtain-seam-left { left: 0; }

        /* Glowing edge when curtain parts */
        .curtain-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg,
            transparent 10%,
            rgba(245,225,164,0.25) 30%,
            rgba(245,225,164,0.45) 50%,
            rgba(245,225,164,0.25) 70%,
            transparent 90%
          );
        }
        .curtain-edge-right { right: -1px; }
        .curtain-edge-left { left: -1px; }

        /* Light bleed between layers */
        .luminous-light-bleed {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50vw;
          height: 50vh;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(245,225,164,0.35) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Service overlays ── */
        .luminous-service-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          gap: 2rem;
        }
        .luminous-keyword {
          font-size: clamp(60px, 10vw, 140px);
          font-weight: 200;
          color: #F5E1A4;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 1;
          will-change: transform, opacity;
          transform-origin: center center;
          text-shadow: 0 2px 20px rgba(0,0,0,0.3);
        }
        .luminous-service-card {
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(245,225,164,0.15);
          padding: 1.8rem 2.4rem;
          max-width: 400px;
          text-align: center;
          position: relative;
          will-change: transform, opacity;
        }
        .luminous-card-accent {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 2px;
          background: #D4AF37;
        }
        .luminous-card-title {
          color: #F5E1A4;
          font-size: clamp(18px, 2vw, 24px);
          font-weight: 500;
          letter-spacing: 0.08em;
          margin: 0 0 0.6rem;
          text-transform: uppercase;
        }
        .luminous-card-desc {
          color: rgba(255,248,231,0.7);
          font-size: clamp(13px, 1.3vw, 16px);
          font-weight: 300;
          line-height: 1.6;
          margin: 0;
        }

        /* ── Wordmark ── */
        .luminous-wordmark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 25;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15em;
          pointer-events: none;
        }
        .luminous-wordmark-top {
          font-size: clamp(48px, 8vw, 120px);
          font-weight: 200;
          color: #F5E1A4;
          letter-spacing: 0.35em;
          text-indent: 0.35em;
          line-height: 1;
        }
        .luminous-wordmark-bottom {
          font-size: clamp(18px, 3vw, 42px);
          font-weight: 400;
          color: rgba(245,225,164,0.55);
          letter-spacing: 0.6em;
          text-indent: 0.6em;
          line-height: 1;
        }

        /* ── Scroll hint ── */
        .luminous-scroll-hint {
          position: absolute;
          bottom: 3rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 25;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
          color: rgba(245,225,164,0.45);
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 400;
        }
        .luminous-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, rgba(245,225,164,0.4), transparent);
          animation: luminousScrollPulse 2s ease-in-out infinite;
        }
        @keyframes luminousScrollPulse {
          0%, 100% { transform: scaleY(1); opacity: 0.5; }
          50% { transform: scaleY(0.6); opacity: 1; }
        }

        /* ── Shimmer ── */
        .luminous-shimmer {
          position: absolute;
          inset: 0;
          z-index: 21;
          pointer-events: none;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(245,225,164,0.03) 45%,
            rgba(245,225,164,0.07) 50%,
            rgba(245,225,164,0.03) 55%,
            transparent 70%
          );
          background-size: 200% 100%;
          animation: luminousShimmer 5s ease-in-out infinite;
        }
        @keyframes luminousShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Cursor light ── */
        .luminous-cursor-light {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,225,164,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 30;
          transform: translate(-50%, -50%);
          transition: opacity 0.4s ease;
        }

        /* ── Sticky button ── */
        .luminous-sticky-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          display: inline-flex;
          align-items: center;
          padding: 0.8em 1.6em;
          background: #B8860B;
          color: #FFF8E7;
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 0;
          transition: background 0.3s ease, box-shadow 0.15s ease, transform 0.2s ease;
          box-shadow: 0 0 8px 2px rgba(184,134,11,0.3);
          will-change: transform, box-shadow;
        }
        .luminous-sticky-btn:hover {
          background: #D4AF37;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .luminous-keyword {
            font-size: clamp(40px, 12vw, 80px);
          }
          .luminous-service-card {
            max-width: 90vw;
            padding: 1.2rem 1.6rem;
          }
          .luminous-wordmark-top {
            font-size: clamp(36px, 12vw, 72px);
          }
          .luminous-wordmark-bottom {
            font-size: clamp(14px, 4vw, 28px);
          }
          .luminous-sticky-btn {
            bottom: 1rem;
            right: 1rem;
            font-size: 12px;
            padding: 0.6em 1.2em;
          }
          .luminous-trust { gap: 0.8rem; }
          .luminous-cta-headline { font-size: clamp(24px, 7vw, 40px); }
          .luminous-cursor-light { display: none; }
        }
      `}</style>
    </section>
  );
}
