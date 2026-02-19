'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface GrandFoyerHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function GrandFoyerHero({ locale, dict }: GrandFoyerHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  const sectionRef = useRef<HTMLElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const glassLeftRef = useRef<HTMLDivElement>(null);
  const glassRightRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subCardRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const [contentVisible, setContentVisible] = useState(false);

  // ── Cursor flashlight + glass panel parallax ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mousePos.current = { x: nx, y: ny };

      // Flashlight
      if (flashlightRef.current) {
        flashlightRef.current.style.left = `${e.clientX - rect.left}px`;
        flashlightRef.current.style.top = `${e.clientY - rect.top}px`;
        flashlightRef.current.style.opacity = '1';
      }

      // Glass panel parallax tilt
      if (window.gsap) {
        const rotX = (ny - 0.5) * 6;
        const rotY = (nx - 0.5) * -6;

        if (glassLeftRef.current) {
          window.gsap.to(glassLeftRef.current, {
            rotateX: rotX * 0.8,
            rotateY: rotY * 0.8,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
        if (glassRightRef.current) {
          window.gsap.to(glassRightRef.current, {
            rotateX: rotX * 1.2,
            rotateY: rotY * 1.2,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
      }
    };

    const handleLeave = () => {
      if (flashlightRef.current) {
        flashlightRef.current.style.opacity = '0';
      }
      if (window.gsap) {
        [glassLeftRef, glassRightRef].forEach((ref) => {
          if (ref.current) {
            window.gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
          }
        });
      }
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

  // ── Main GSAP animation ──
  useEffect(() => {
    if (!gsapReady || hasAnimated.current) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const CustomEase = window.CustomEase;
    if (!gsap || !ScrollTrigger || !SplitText || !CustomEase) return;

    hasAnimated.current = true;
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

    CustomEase.create('foyer', 'M0,0 C0.22,0.61 0.36,1 1,1');
    CustomEase.create('grandEntrance', 'M0,0 C0.05,0.7 0.1,1 1,1');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'foyer' } });

      // Phase 1: Atmosphere builds — orbs fade in, mesh pulses
      tl.fromTo(meshRef.current, { opacity: 0 }, { opacity: 1, duration: 2 }, 0);
      tl.fromTo(grainRef.current, { opacity: 0 }, { opacity: 0.06, duration: 2 }, 0);
      tl.fromTo(vignetteRef.current, { opacity: 0 }, { opacity: 1, duration: 2 }, 0);

      // Orbs drift in
      const orbEls = orbsRef.current?.querySelectorAll('.foyer-orb');
      if (orbEls) {
        orbEls.forEach((orb, i) => {
          tl.fromTo(orb,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 2.5, ease: 'grandEntrance' },
            0.2 + i * 0.3
          );
          // Infinite gentle drift
          gsap.to(orb, {
            x: `random(-60, 60)`,
            y: `random(-40, 40)`,
            duration: `random(8, 14)`,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.5,
          });
        });
      }

      // Phase 2: Grid appears
      tl.fromTo(gridRef.current, { opacity: 0 }, { opacity: 0.04, duration: 1.8 }, 0.6);

      // Phase 3: Glass panels slide in
      tl.fromTo(glassLeftRef.current,
        { x: -120, opacity: 0, rotateY: 15 },
        { x: 0, opacity: 1, rotateY: 0, duration: 1.6, ease: 'grandEntrance' },
        1.2
      );
      tl.fromTo(glassRightRef.current,
        { x: 120, opacity: 0, rotateY: -15 },
        { x: 0, opacity: 1, rotateY: 0, duration: 1.6, ease: 'grandEntrance' },
        1.4
      );

      // Phase 4: Kicker appears
      tl.fromTo(kickerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        1.8
      );

      // Phase 5: Headline with SplitText char reveal
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: 'chars,lines', linesClass: 'foyer-line' });
        tl.fromTo(split.chars,
          { opacity: 0, y: 60, rotateX: -40 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.03, ease: 'grandEntrance' },
          2.0
        );
      }

      // Phase 6: Subtitle card rises
      tl.fromTo(subCardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'grandEntrance' },
        2.6
      );

      // Phase 7: Scroll hint
      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 1 },
        3.2
      );

      // Content visible flag
      tl.call(() => setContentVisible(true), [], 2.0);

      // ── Flashlight warm glow ──
      if (flashlightRef.current) {
        gsap.set(flashlightRef.current, { opacity: 0 });
      }

      // ── Scroll-driven parallax dispersal ──
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self: { progress: number }) => {
            const p = self.progress;

            // Deep layers move slower
            if (meshRef.current) {
              gsap.set(meshRef.current, { y: p * -80 });
            }

            // Orbs drift up slowly
            if (orbsRef.current) {
              gsap.set(orbsRef.current, { y: p * -120 });
            }

            // Grid recedes
            if (gridRef.current) {
              gsap.set(gridRef.current, {
                y: p * -60,
                opacity: Math.max(0, 0.04 - p * 0.06),
              });
            }

            // Glass panels separate
            if (glassLeftRef.current) {
              gsap.set(glassLeftRef.current, {
                y: p * -200,
                x: p * -100,
                opacity: Math.max(0, 1 - p * 2),
              });
            }
            if (glassRightRef.current) {
              gsap.set(glassRightRef.current, {
                y: p * -160,
                x: p * 100,
                opacity: Math.max(0, 1 - p * 2),
              });
            }

            // Content fades with blur
            if (headlineRef.current) {
              gsap.set(headlineRef.current, {
                y: p * -180,
                opacity: Math.max(0, 1 - p * 2.5),
                filter: `blur(${p * 12}px)`,
              });
            }
            if (subCardRef.current) {
              gsap.set(subCardRef.current, {
                y: p * -140,
                opacity: Math.max(0, 1 - p * 2.2),
              });
            }
            if (kickerRef.current) {
              gsap.set(kickerRef.current, {
                y: p * -220,
                opacity: Math.max(0, 1 - p * 2),
              });
            }

            // Vignette intensifies
            if (vignetteRef.current) {
              vignetteRef.current.style.background = `radial-gradient(ellipse at center, transparent ${60 - p * 30}%, rgba(10,9,8,${0.7 + p * 0.3}) 100%)`;
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
        style={{
          height: '100vh',
          minHeight: '700px',
          background: '#0A0908',
          perspective: '1200px',
        }}
      >
        {/* ── Layer 0: Animated Gradient Mesh Background ── */}
        <div ref={meshRef} className="absolute inset-0 opacity-0" style={{ zIndex: 1 }}>
          <div className="foyer-mesh-a absolute inset-0" />
          <div className="foyer-mesh-b absolute inset-0" />
          <div className="foyer-mesh-c absolute inset-0" />
          <div className="foyer-mesh-d absolute inset-0" />
        </div>

        {/* ── Layer 1: Luminous Orbs (distant chandeliers) ── */}
        <div ref={orbsRef} className="absolute inset-0" style={{ zIndex: 2 }}>
          <div
            className="foyer-orb absolute"
            style={{
              width: '500px',
              height: '500px',
              top: '10%',
              left: '15%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, rgba(184,134,11,0.04) 40%, transparent 70%)',
              filter: 'blur(80px)',
              borderRadius: '50%',
            }}
          />
          <div
            className="foyer-orb absolute"
            style={{
              width: '400px',
              height: '400px',
              top: '25%',
              right: '10%',
              background: 'radial-gradient(circle, rgba(245,225,164,0.1) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)',
              filter: 'blur(90px)',
              borderRadius: '50%',
            }}
          />
          <div
            className="foyer-orb absolute"
            style={{
              width: '600px',
              height: '600px',
              bottom: '5%',
              left: '40%',
              background: 'radial-gradient(circle, rgba(184,134,11,0.08) 0%, rgba(139,90,43,0.03) 40%, transparent 70%)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />
          <div
            className="foyer-orb absolute"
            style={{
              width: '350px',
              height: '350px',
              top: '50%',
              left: '5%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.09) 0%, rgba(139,90,43,0.02) 40%, transparent 70%)',
              filter: 'blur(70px)',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* ── Layer 2: Perspective Grid (marble floor / architectural lines) ── */}
        <svg
          ref={gridRef}
          className="absolute inset-0 w-full h-full opacity-0"
          style={{ zIndex: 3 }}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Horizontal receding lines */}
          {Array.from({ length: 12 }, (_, i) => {
            const y = 200 + i * 70;
            const spread = (i / 11) * 400;
            return (
              <line
                key={`h-${i}`}
                x1={960 - 800 - spread}
                y1={y}
                x2={960 + 800 + spread}
                y2={y}
                stroke="rgba(212,175,55,0.5)"
                strokeWidth="0.5"
              />
            );
          })}
          {/* Vertical converging lines to vanishing point */}
          {Array.from({ length: 16 }, (_, i) => {
            const x = (i / 15) * 1920;
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1={1080}
                x2={960}
                y2={100}
                stroke="rgba(212,175,55,0.3)"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        {/* ── Cursor Flashlight ── */}
        <div
          ref={flashlightRef}
          className="absolute pointer-events-none"
          style={{
            zIndex: 4,
            width: '500px',
            height: '500px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, rgba(184,134,11,0.02) 30%, transparent 60%)',
            borderRadius: '50%',
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* ── Layer 3: Glassmorphism Panel — Left (CTA card) ── */}
        <div
          ref={glassLeftRef}
          className="absolute opacity-0"
          style={{
            zIndex: 6,
            left: '5%',
            bottom: '12%',
            width: 'clamp(340px, 30vw, 480px)',
            transformStyle: 'preserve-3d',
            perspective: '800px',
          }}
        >
          {/* Kicker */}
          <div
            ref={kickerRef}
            className="opacity-0"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(11px, 0.8vw, 14px)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.7)',
              marginBottom: '1.5rem',
            }}
          >
            {hero.kicker || 'Transformative Aesthetic Mastery'}
          </div>

          {/* Headline — editorial, lower-left, NOT centered */}
          <div
            ref={headlineRef}
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(42px, 5.5vw, 96px)',
              fontWeight: 300,
              lineHeight: 1.05,
              color: '#F5E1A4',
              letterSpacing: '-0.02em',
              marginBottom: '2rem',
              transformStyle: 'preserve-3d',
            }}
          >
            <div>{hero.headlineLine1 || 'Precision.'}</div>
            <div>{hero.headlineLine2 || 'Elegance.'}</div>
            <div>{hero.headlineLine3 || 'You.'}</div>
          </div>

          {/* Subtitle glass card */}
          <div
            ref={subCardRef}
            className="opacity-0"
            style={{
              background: 'rgba(212,175,55,0.04)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(212,175,55,0.12)',
              borderRadius: '12px',
              padding: 'clamp(20px, 2vw, 32px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(212,175,55,0.08)',
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(14px, 1.1vw, 18px)',
                lineHeight: 1.7,
                color: 'rgba(245,225,164,0.75)',
                marginBottom: '1.5rem',
                fontWeight: 300,
              }}
            >
              {hero.subheadline || 'World-class aesthetic surgery and wellness, delivered with uncompromising care in Istanbul.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact`}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                  color: '#0A0908',
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'box-shadow 0.3s ease',
                  boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
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
                  padding: '14px 28px',
                  background: 'transparent',
                  color: 'rgba(212,175,55,0.8)',
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  borderRadius: '8px',
                  border: '1px solid rgba(212,175,55,0.25)',
                  textDecoration: 'none',
                  transition: 'border-color 0.3s ease, color 0.3s ease',
                }}
              >
                {hero.ctaSecondary || 'Contact via WhatsApp'}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Layer 3: Glassmorphism Panel — Right (Trust Badges) ── */}
        <div
          ref={glassRightRef}
          className="absolute opacity-0"
          style={{
            zIndex: 6,
            right: '5%',
            top: '20%',
            width: 'clamp(200px, 16vw, 280px)',
            transformStyle: 'preserve-3d',
            perspective: '800px',
          }}
        >
          <div
            style={{
              background: 'rgba(212,175,55,0.03)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,175,55,0.1)',
              borderRadius: '14px',
              padding: 'clamp(20px, 1.8vw, 28px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(212,175,55,0.06)',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '10px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(212,175,55,0.5)',
                marginBottom: '1.2rem',
                paddingBottom: '0.8rem',
                borderBottom: '1px solid rgba(212,175,55,0.08)',
              }}
            >
              {hero.established || 'EST. ISTANBUL'}
            </div>

            {(() => { const badges = [hero.badge1, hero.badge2, hero.badge3, hero.badge4].filter(Boolean); return badges.map((badge, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 0',
                  borderBottom: i < badges.length - 1 ? '1px solid rgba(212,175,55,0.06)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'rgba(212,175,55,0.4)',
                    flexShrink: 0,
                    boxShadow: '0 0 8px rgba(212,175,55,0.2)',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(12px, 0.9vw, 15px)',
                    color: 'rgba(245,225,164,0.65)',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                  }}
                >
                  {badge}
                </span>
              </div>
            )); })()}
          </div>
        </div>

        {/* ── Film Grain Overlay ── */}
        <div
          ref={grainRef}
          className="absolute inset-0 pointer-events-none foyer-grain opacity-0"
          style={{ zIndex: 8 }}
        />

        {/* ── Vignette ── */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            zIndex: 9,
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(10,9,8,0.7) 100%)',
          }}
        />

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
              color: 'rgba(212,175,55,0.4)',
            }}
          >
            {hero.scrollHint || 'Scroll to explore'}
          </span>
          <div className="foyer-scroll-line" />
        </div>

        {/* ── Visibility fallback overlay ── */}
        {!contentVisible && (
          <div
            className="absolute inset-0"
            style={{ zIndex: 20, background: '#0A0908', pointerEvents: 'none' }}
          />
        )}
      </section>

      <style jsx>{`
        /* ── Gradient Mesh Layers ── */
        .foyer-mesh-a {
          background: radial-gradient(ellipse at 25% 30%, rgba(184,134,11,0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at 75% 70%, rgba(139,90,43,0.06) 0%, transparent 50%);
          animation: meshDriftA 12s ease-in-out infinite alternate;
        }
        .foyer-mesh-b {
          background: radial-gradient(ellipse at 60% 20%, rgba(212,175,55,0.06) 0%, transparent 45%),
                      radial-gradient(ellipse at 30% 80%, rgba(100,70,30,0.05) 0%, transparent 50%);
          animation: meshDriftB 16s ease-in-out infinite alternate;
          mix-blend-mode: screen;
        }
        .foyer-mesh-c {
          background: radial-gradient(ellipse at 80% 50%, rgba(245,225,164,0.04) 0%, transparent 40%),
                      radial-gradient(ellipse at 10% 40%, rgba(184,134,11,0.03) 0%, transparent 45%);
          animation: meshDriftC 20s ease-in-out infinite alternate;
          mix-blend-mode: lighten;
        }
        .foyer-mesh-d {
          background: radial-gradient(ellipse at 50% 50%, rgba(30,25,18,0.8) 0%, rgba(10,9,8,1) 100%);
        }

        @keyframes meshDriftA {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes meshDriftB {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-40px, 25px) scale(1.08); }
        }
        @keyframes meshDriftC {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(20px, 15px) scale(1.03); }
        }

        /* ── Film Grain ── */
        .foyer-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: overlay;
        }

        /* ── Scroll Line ── */
        .foyer-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(212,175,55,0.4), transparent);
          animation: scrollPulse 2.5s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
          50%      { opacity: 0.8; transform: scaleY(1); transform-origin: top; }
        }

        /* ── Headline line overflow for SplitText ── */
        :global(.foyer-line) {
          overflow: hidden;
          perspective: 600px;
        }

        /* ── Mobile adjustments ── */
        @media (max-width: 768px) {
          .foyer-mesh-a,
          .foyer-mesh-b,
          .foyer-mesh-c {
            animation-duration: 8s;
          }
        }
      `}</style>
    </>
  );
}
