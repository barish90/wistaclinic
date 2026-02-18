'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface AuroraHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ── Blob configuration — 3 depth layers ── */
const BLOBS = [
  // Far layer — largest, blurriest, slowest
  { id: 0, layer: 'far', size: 750, blur: 80, color: 'rgba(184,134,11,0.10)', x: '15%', y: '20%', dur: 22, rotateDur: 40, breathDur: 14 },
  { id: 1, layer: 'far', size: 600, blur: 70, color: 'rgba(139,90,43,0.08)', x: '65%', y: '60%', dur: 26, rotateDur: 50, breathDur: 16 },
  // Mid layer
  { id: 2, layer: 'mid', size: 520, blur: 55, color: 'rgba(212,175,55,0.12)', x: '55%', y: '15%', dur: 18, rotateDur: 35, breathDur: 12 },
  { id: 3, layer: 'mid', size: 450, blur: 50, color: 'rgba(196,133,106,0.10)', x: '20%', y: '65%', dur: 20, rotateDur: 30, breathDur: 10 },
  { id: 4, layer: 'mid', size: 380, blur: 45, color: 'rgba(245,225,164,0.09)', x: '80%', y: '35%', dur: 16, rotateDur: 38, breathDur: 13 },
  // Near layer — smaller, sharper, faster
  { id: 5, layer: 'near', size: 340, blur: 40, color: 'rgba(212,175,55,0.15)', x: '40%', y: '45%', dur: 14, rotateDur: 25, breathDur: 8 },
  { id: 6, layer: 'near', size: 300, blur: 35, color: 'rgba(196,133,106,0.13)', x: '75%', y: '70%', dur: 12, rotateDur: 28, breathDur: 9 },
  { id: 7, layer: 'near', size: 280, blur: 38, color: 'rgba(255,248,231,0.08)', x: '10%', y: '40%', dur: 15, rotateDur: 32, breathDur: 11 },
];

const BORDER_SHAPES = [
  '30% 70% 70% 30% / 30% 30% 70% 70%',
  '70% 30% 30% 70% / 70% 70% 30% 30%',
  '40% 60% 30% 70% / 60% 30% 70% 40%',
  '60% 40% 70% 30% / 40% 70% 30% 60%',
  '50% 50% 40% 60% / 35% 65% 50% 50%',
];

export default function AuroraHero({ locale, dict }: AuroraHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  const sectionRef = useRef<HTMLElement>(null);
  const meshContainerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headlineRef = useRef<HTMLDivElement>(null);
  const headlineClipRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const [contentVisible, setContentVisible] = useState(false);

  // ── Cursor → nudge nearest blob ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mousePos.current = { x: nx, y: ny };

      if (!window.gsap) return;

      // Find and nudge the 2 nearest blobs toward cursor
      const blobs = blobRefs.current.filter(Boolean) as HTMLDivElement[];
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const distances = blobs.map((blob, i) => {
        const bRect = blob.getBoundingClientRect();
        const bx = bRect.left + bRect.width / 2 - rect.left;
        const by = bRect.top + bRect.height / 2 - rect.top;
        const dist = Math.sqrt((cursorX - bx) ** 2 + (cursorY - by) ** 2);
        return { i, dist, bx, by };
      });

      distances.sort((a, b) => a.dist - b.dist);

      distances.forEach(({ i, dist }, rank) => {
        const blob = blobs[i];
        if (!blob) return;
        const maxDist = 500;
        if (rank < 2 && dist < maxDist) {
          const force = (1 - dist / maxDist) * 30;
          const angle = Math.atan2(cursorY - (distances[rank].by), cursorX - (distances[rank].bx));
          window.gsap.to(blob, {
            x: `+=${Math.cos(angle) * force * 0.15}`,
            y: `+=${Math.sin(angle) * force * 0.15}`,
            duration: 2,
            ease: 'power2.out',
            overwrite: 'auto',
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
    window.gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: 'power3.out' });
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
    if (!gsap || !ScrollTrigger || !SplitText || !CustomEase) {
      // Missing plugins — unblock UI immediately
      setContentVisible(true);
      hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

    CustomEase.create('aurora', 'M0,0 C0.16,0.73 0.3,1 1,1');
    CustomEase.create('auroraGentle', 'M0,0 C0.25,0.46 0.45,0.94 1,1');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'aurora' } });

      // ── Phase 1: Blobs emerge — the aurora awakens ──
      const blobs = blobRefs.current.filter(Boolean) as HTMLDivElement[];
      blobs.forEach((blob, i) => {
        const cfg = BLOBS[i];
        if (!cfg) return;

        // Entrance: fade + scale in
        tl.fromTo(blob,
          { opacity: 0, scale: 0.3 },
          { opacity: 1, scale: 1, duration: 2.8, ease: 'auroraGentle' },
          0.1 + i * 0.15
        );

        // Infinite drift
        gsap.to(blob, {
          x: `random(-80, 80)`,
          y: `random(-60, 60)`,
          duration: cfg.dur,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        });

        // Infinite rotation
        gsap.to(blob, {
          rotation: 360,
          duration: cfg.rotateDur,
          ease: 'none',
          repeat: -1,
        });

        // Breathing scale
        gsap.to(blob, {
          scale: `random(0.85, 1.15)`,
          duration: cfg.breathDur,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.3,
        });

        // Border-radius morphing
        const shapes = [...BORDER_SHAPES].sort(() => Math.random() - 0.5);
        const morphTl = gsap.timeline({ repeat: -1 });
        shapes.forEach((shape) => {
          morphTl.to(blob, {
            borderRadius: shape,
            duration: cfg.breathDur * 0.8,
            ease: 'sine.inOut',
          });
        });
      });

      // Film grain fades in
      tl.fromTo(grainRef.current, { opacity: 0 }, { opacity: 0.05, duration: 2 }, 0);

      // ── Phase 2: Content reveals — kicker ──
      tl.fromTo(kickerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2 },
        1.6
      );

      // ── Phase 3: Headline — word reveal with SplitText ──
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: 'words,lines', linesClass: 'aurora-line' });
        tl.fromTo(split.words,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1.4, stagger: 0.12, ease: 'aurora' },
          2.0
        );
      }

      // ── Phase 4: Shimmer rule expands ──
      tl.fromTo(ruleRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1.4, ease: 'auroraGentle' },
        2.8
      );

      // ── Phase 5: Subheadline + CTA ──
      tl.fromTo(subRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1 },
        3.2
      );
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        3.5
      );

      // ── Phase 6: Badges ──
      tl.fromTo(badgesRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1 },
        3.8
      );

      // ── Phase 7: Scroll hint ──
      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.8 },
        4.2
      );

      tl.call(() => setContentVisible(true), [], 2.0);

      // ── Scroll: mesh compression + content fade ──
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self: { progress: number }) => {
            const p = self.progress;

            // Mesh compresses vertically — "light collapsing"
            if (meshContainerRef.current) {
              gsap.set(meshContainerRef.current, {
                scaleY: 1 - p * 0.7,
                opacity: 1 - p * 1.5,
                transformOrigin: 'center center',
              });
            }

            // Content slides up and fades
            const contentEls = [kickerRef, headlineRef, ruleRef, subRef, ctaRef, badgesRef];
            contentEls.forEach((ref, i) => {
              if (ref.current) {
                gsap.set(ref.current, {
                  y: p * -(100 + i * 20),
                  opacity: Math.max(0, 1 - p * 2.5),
                });
              }
            });

            // Grain intensifies slightly
            if (grainRef.current) {
              gsap.set(grainRef.current, { opacity: 0.05 + p * 0.04 });
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  // ── Badge data ──
  const badges = [hero.badge1, hero.badge2, hero.badge3, hero.badge4].filter(Boolean);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{
          height: '100vh',
          minHeight: '700px',
          background: '#0F0C08',
        }}
      >
        {/* ── Living Gradient Mesh — the main spectacle ── */}
        <div
          ref={meshContainerRef}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        >
          {BLOBS.map((cfg, i) => (
            <div
              key={cfg.id}
              ref={(el) => { blobRefs.current[i] = el; }}
              className="absolute aurora-blob"
              style={{
                width: `${cfg.size}px`,
                height: `${cfg.size}px`,
                left: cfg.x,
                top: cfg.y,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle at 40% 40%, ${cfg.color}, transparent 70%)`,
                filter: `blur(${cfg.blur}px)`,
                borderRadius: BORDER_SHAPES[i % BORDER_SHAPES.length],
                mixBlendMode: cfg.layer === 'far' ? 'lighten' : 'screen',
                opacity: 0,
                willChange: 'transform, border-radius, opacity',
              }}
            />
          ))}

          {/* Warm ambient base glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(139,90,43,0.06) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* ── Film Grain ── */}
        <div
          ref={grainRef}
          className="absolute inset-0 pointer-events-none aurora-grain opacity-0"
          style={{ zIndex: 2 }}
        />

        {/* ── Content Layer — centered, palatial ── */}
        <div
          className="relative flex flex-col items-center justify-center text-center h-full px-6"
          style={{ zIndex: 5 }}
        >
          {/* Kicker */}
          <div
            ref={kickerRef}
            className="opacity-0"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(10px, 0.75vw, 13px)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.6)',
              marginBottom: 'clamp(16px, 2vh, 28px)',
            }}
          >
            {hero.kicker || 'Transformative Aesthetic Mastery'}
          </div>

          {/* Headline — liquid gold text via background-clip */}
          <div
            ref={headlineRef}
            className="aurora-headline"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(44px, 6vw, 110px)',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
              marginBottom: 'clamp(20px, 2.5vh, 36px)',
              color: '#F5E1A4',
            }}
          >
            {(hero.headlineLine1 || 'Precision.')}{' '}
            {(hero.headlineLine2 || 'Elegance.')}{' '}
            {(hero.headlineLine3 || 'You.')}
          </div>

          {/* Shimmer horizontal rule */}
          <div
            ref={ruleRef}
            className="aurora-shimmer-rule opacity-0"
            style={{
              width: 'clamp(120px, 12vw, 200px)',
              height: '1px',
              marginBottom: 'clamp(20px, 2.5vh, 36px)',
              transformOrigin: 'center',
            }}
          />

          {/* Subheadline */}
          <p
            ref={subRef}
            className="opacity-0"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(15px, 1.2vw, 20px)',
              lineHeight: 1.7,
              color: 'rgba(245,225,164,0.65)',
              maxWidth: '560px',
              marginBottom: 'clamp(24px, 3vh, 40px)',
              fontWeight: 300,
            }}
          >
            {hero.subheadline || 'World-class aesthetic surgery and wellness, delivered with uncompromising care in Istanbul.'}
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-wrap justify-center gap-3 opacity-0"
            style={{ marginBottom: 'clamp(28px, 3.5vh, 48px)' }}
          >
            <Link
              href={`/${locale}/contact`}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              className="aurora-cta-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '15px 32px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                color: '#0F0C08',
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.08)',
                transition: 'box-shadow 0.4s ease, transform 0.4s ease',
              }}
            >
              {hero.ctaPrimary || 'Book Your Consultation'}
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`/${locale}/contact`}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '15px 32px',
                background: 'rgba(212,175,55,0.06)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: 'rgba(245,225,164,0.8)',
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: '8px',
                border: '1px solid rgba(212,175,55,0.18)',
                textDecoration: 'none',
                transition: 'border-color 0.3s ease, background 0.3s ease',
              }}
            >
              {hero.ctaSecondary || 'Contact via WhatsApp'}
            </Link>
          </div>

          {/* Trust badges — horizontal with separator dots */}
          <div
            ref={badgesRef}
            className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 opacity-0"
          >
            {badges.map((badge, i) => (
              <div key={i} className="flex items-center gap-5">
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(11px, 0.85vw, 14px)',
                    color: 'rgba(212,175,55,0.45)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                  }}
                >
                  {badge}
                </span>
                {i < badges.length - 1 && (
                  <span
                    style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: 'rgba(212,175,55,0.25)',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Scroll Hint ── */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
          style={{ zIndex: 10 }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.35)',
            }}
          >
            {hero.scrollHint || 'Scroll to explore'}
          </span>
          <div className="aurora-scroll-line" />
        </div>

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'radial-gradient(ellipse at center, transparent 55%, rgba(15,12,8,0.65) 100%)',
          }}
        />

        {/* ── Visibility fallback ── */}
        {!contentVisible && (
          <div
            className="absolute inset-0"
            style={{ zIndex: 20, background: '#0F0C08', pointerEvents: 'none' }}
          />
        )}
      </section>

      <style jsx>{`
        /* ── Headline gradient text — applied to element AND all SplitText children ── */
        .aurora-headline,
        .aurora-headline :global(div),
        .aurora-headline :global(span) {
          background: linear-gradient(135deg, #D4AF37 0%, #F5E1A4 25%, #C4856A 50%, #D4AF37 75%, #FFF8E7 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: auroraGradientShift 8s ease-in-out infinite alternate;
        }
        @keyframes auroraGradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── Shimmer Rule ── */
        .aurora-shimmer-rule {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(212,175,55,0.1) 15%,
            rgba(245,225,164,0.5) 40%,
            rgba(212,175,55,0.8) 50%,
            rgba(245,225,164,0.5) 60%,
            rgba(212,175,55,0.1) 85%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmerSlide 3.5s ease-in-out infinite;
        }
        @keyframes shimmerSlide {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* ── Film Grain ── */
        .aurora-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: overlay;
        }

        /* ── Scroll Line ── */
        .aurora-scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, rgba(212,175,55,0.35), transparent);
          animation: auroraScrollPulse 2.5s ease-in-out infinite;
        }
        @keyframes auroraScrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.5); transform-origin: top; }
          50%      { opacity: 0.7; transform: scaleY(1); transform-origin: top; }
        }

        /* ── CTA hover glow ── */
        .aurora-cta-primary:hover {
          box-shadow: 0 6px 32px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.12);
        }

        /* ── SplitText line overflow ── */
        :global(.aurora-line) {
          overflow: hidden;
        }

        /* ── Mobile: reduce blob count visually ── */
        @media (max-width: 768px) {
          .aurora-blob:nth-child(n+6) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
