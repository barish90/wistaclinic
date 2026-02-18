'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface RevealHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function RevealHero({ locale, dict }: RevealHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  const sectionRef = useRef<HTMLElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const lightBleedRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const establishedRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [doorsOpen, setDoorsOpen] = useState(false);

  // ── Cursor flashlight (subtle warm glow) ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !doorsOpen) return;

    const handleMove = (e: MouseEvent) => {
      if (flashlightRef.current) {
        const rect = section.getBoundingClientRect();
        flashlightRef.current.style.left = `${e.clientX - rect.left}px`;
        flashlightRef.current.style.top = `${e.clientY - rect.top}px`;
        flashlightRef.current.style.opacity = '1';
      }
    };
    const handleLeave = () => {
      if (flashlightRef.current) flashlightRef.current.style.opacity = '0';
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, [doorsOpen]);

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
      setDoorsOpen(true);
      hasAnimated.current = true;
    }
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        setContentVisible(true);
        setDoorsOpen(true);
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

    CustomEase.create('doorSwing', 'M0,0 C0.17,0.67 0.24,1.00 0.38,1.00 0.50,1.00 0.58,0.98 0.64,0.98 0.78,0.98 0.85,1 1,1');
    CustomEase.create('revealRise', 'M0,0 C0.14,0.73 0.32,1 1,1');

    let blurTimeout: ReturnType<typeof setTimeout> | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'revealRise' } });

      // ── Phase 0: Seam pulse — brief, bright, anticipatory ──
      tl.set(seamRef.current, { opacity: 0.4 }, 0);
      tl.to(seamRef.current, { opacity: 1, duration: 0.3, ease: 'power2.inOut' }, 0);
      tl.to(seamRef.current, { opacity: 0.5, duration: 0.2, ease: 'power2.inOut' }, 0.3);
      tl.to(seamRef.current, { opacity: 1, duration: 0.2, ease: 'power2.inOut' }, 0.5);

      // ── Phase 1: Doors SPLIT (starts at 0.7s — quick buildup) ──
      tl.to(doorLeftRef.current, {
        xPercent: -105,
        duration: 1.6,
        ease: 'doorSwing',
        onStart: () => {
          if (doorLeftRef.current) doorLeftRef.current.style.filter = 'blur(3px)';
          if (doorRightRef.current) doorRightRef.current.style.filter = 'blur(3px)';
          blurTimeout = setTimeout(() => {
            if (doorLeftRef.current) doorLeftRef.current.style.filter = 'none';
            if (doorRightRef.current) doorRightRef.current.style.filter = 'none';
            blurTimeout = null;
          }, 350);
        },
      }, 0.7);
      tl.to(doorRightRef.current, {
        xPercent: 105,
        duration: 1.6,
        ease: 'doorSwing',
      }, 0.7);

      // Seam vanishes as doors begin moving
      tl.to(seamRef.current, { opacity: 0, duration: 0.3 }, 0.7);

      // ── Phase 1b: Light bleed — golden warmth pours out ──
      tl.fromTo(lightBleedRef.current,
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 3, duration: 1.8, ease: 'power2.out' },
        0.7
      );
      tl.to(lightBleedRef.current, { opacity: 0, duration: 1 }, 1.8);

      tl.call(() => setDoorsOpen(true), [], 1.6);

      // ── Phase 2: Ambient orbs + grain emerge as doors are midway ──
      const orbEls = orbsRef.current?.querySelectorAll('.reveal-orb');
      if (orbEls) {
        orbEls.forEach((orb, i) => {
          tl.fromTo(orb,
            { opacity: 0, scale: 0.6 },
            { opacity: 1, scale: 1, duration: 1.6, ease: 'revealRise' },
            1.0 + i * 0.15
          );
          gsap.to(orb, {
            x: `random(-40, 40)`,
            y: `random(-30, 30)`,
            duration: `random(10, 16)`,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: i * 0.8,
          });
        });
      }

      tl.fromTo(grainRef.current, { opacity: 0 }, { opacity: 0.05, duration: 1.2 }, 1.0);

      // ── Phase 3: Frame + content revealed as doors clear ──
      tl.fromTo(frameRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        1.3
      );

      // Kicker
      tl.fromTo(kickerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.5
      );

      // Headline word reveal — THE moment
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: 'words,lines', linesClass: 'reveal-line' });
        tl.fromTo(split.words,
          { opacity: 0, y: 35, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.08, ease: 'revealRise' },
          1.7
        );
      }

      // Shimmer rule
      tl.fromTo(ruleRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1, ease: 'revealRise' },
        2.2
      );

      // Subheadline
      tl.fromTo(subRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8 },
        2.4
      );

      // CTA
      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8 },
        2.6
      );

      // Badges
      tl.fromTo(badgesRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7 },
        2.8
      );

      // Established text
      tl.fromTo(establishedRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.7 },
        2.9
      );

      // Scroll hint
      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.6 },
        3.2
      );

      tl.call(() => setContentVisible(true), [], 1.7);

      // ── Scroll: frame contracts, content fades, space darkens ──
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self: { progress: number }) => {
            const p = self.progress;

            // Frame contracts inward (slower parallax)
            if (frameRef.current) {
              const inset = 40 + p * 80;
              frameRef.current.style.inset = `${inset}px`;
              gsap.set(frameRef.current, {
                opacity: Math.max(0, 1 - p * 2),
              });
            }

            // Content fades and rises
            const contentEls = [kickerRef, headlineRef, ruleRef, subRef, ctaRef, badgesRef];
            contentEls.forEach((ref, i) => {
              if (ref.current) {
                gsap.set(ref.current, {
                  y: p * -(80 + i * 15),
                  opacity: Math.max(0, 1 - p * 2.5),
                });
              }
            });

            // Established text
            if (establishedRef.current) {
              gsap.set(establishedRef.current, { opacity: Math.max(0, 1 - p * 3) });
            }

            // Orbs dim
            if (orbsRef.current) {
              gsap.set(orbsRef.current, {
                opacity: Math.max(0, 1 - p * 2),
                y: p * -60,
              });
            }

            // Background darkens
            if (sectionRef.current) {
              const darkness = Math.min(1, p * 0.6);
              sectionRef.current.style.background = `linear-gradient(to bottom, rgba(26,21,16,${1 - darkness * 0.3}) 0%, rgba(10,8,5,1) 100%)`;
            }
          },
        });
      }
    }, sectionRef);

    return () => {
      if (blurTimeout) clearTimeout(blurTimeout);
      ctx.revert();
    };
  }, [gsapReady]);

  const badges = [hero.badge1, hero.badge2, hero.badge3, hero.badge4].filter(Boolean);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{
          height: '100vh',
          minHeight: '700px',
          background: '#1A1510',
        }}
      >
        {/* ── Warm ambient base ── */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: 'radial-gradient(ellipse at 50% 40%, rgba(139,90,43,0.08) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(26,21,16,1) 0%, transparent 50%)',
          }}
        />

        {/* ── Ambient Orbs ── */}
        <div ref={orbsRef} className="absolute inset-0" style={{ zIndex: 2 }}>
          <div
            className="reveal-orb absolute"
            style={{
              width: '500px', height: '500px', top: '15%', left: '20%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 65%)',
              filter: 'blur(70px)', borderRadius: '50%',
            }}
          />
          <div
            className="reveal-orb absolute"
            style={{
              width: '420px', height: '420px', top: '30%', right: '15%',
              background: 'radial-gradient(circle, rgba(184,134,11,0.07) 0%, transparent 65%)',
              filter: 'blur(80px)', borderRadius: '50%',
            }}
          />
          <div
            className="reveal-orb absolute"
            style={{
              width: '350px', height: '350px', bottom: '20%', left: '50%',
              background: 'radial-gradient(circle, rgba(196,133,106,0.06) 0%, transparent 65%)',
              filter: 'blur(60px)', borderRadius: '50%', transform: 'translateX(-50%)',
            }}
          />
        </div>

        {/* ── Decorative Gold Border Frame ── */}
        <div
          ref={frameRef}
          className="absolute reveal-frame opacity-0"
          style={{
            zIndex: 3,
            inset: '40px',
            borderRadius: '16px',
            pointerEvents: 'none',
          }}
        />

        {/* ── Cursor Flashlight ── */}
        <div
          ref={flashlightRef}
          className="absolute pointer-events-none"
          style={{
            zIndex: 4,
            width: '400px', height: '400px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 55%)',
            borderRadius: '50%',
            opacity: 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* ── Content (hidden behind doors until they open) ── */}
        <div
          className="relative flex flex-col items-center justify-center text-center h-full px-8"
          style={{ zIndex: 5, opacity: doorsOpen ? 1 : 0, transition: 'opacity 0.3s ease' }}
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
              color: 'rgba(212,175,55,0.55)',
              marginBottom: 'clamp(14px, 1.8vh, 24px)',
            }}
          >
            {hero.kicker || 'Transformative Aesthetic Mastery'}
          </div>

          {/* Headline */}
          <div
            ref={headlineRef}
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(42px, 5.8vw, 100px)',
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#F5E1A4',
              maxWidth: '850px',
              marginBottom: 'clamp(18px, 2.2vh, 32px)',
            }}
          >
            {(hero.headlineLine1 || 'Precision.')}{' '}
            {(hero.headlineLine2 || 'Elegance.')}{' '}
            {(hero.headlineLine3 || 'You.')}
          </div>

          {/* Shimmer Rule */}
          <div
            ref={ruleRef}
            className="reveal-shimmer-rule opacity-0"
            style={{
              width: 'clamp(100px, 10vw, 180px)',
              height: '1px',
              marginBottom: 'clamp(18px, 2.2vh, 32px)',
              transformOrigin: 'center',
            }}
          />

          {/* Subheadline */}
          <p
            ref={subRef}
            className="opacity-0"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: 'clamp(14px, 1.1vw, 19px)',
              lineHeight: 1.7,
              color: 'rgba(245,225,164,0.6)',
              maxWidth: '520px',
              marginBottom: 'clamp(22px, 2.8vh, 38px)',
              fontWeight: 300,
            }}
          >
            {hero.subheadline || 'World-class aesthetic surgery and wellness, delivered with uncompromising care in Istanbul.'}
          </p>

          {/* CTA */}
          <div ref={ctaRef} className="flex flex-wrap justify-center gap-3 opacity-0" style={{ marginBottom: 'clamp(26px, 3.2vh, 44px)' }}>
            <Link
              href={`/${locale}/contact`}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 30px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                color: '#1A1510',
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '14px', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                borderRadius: '8px', textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(212,175,55,0.25)',
                transition: 'box-shadow 0.3s ease',
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
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 30px',
                background: 'rgba(212,175,55,0.05)',
                backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                color: 'rgba(245,225,164,0.75)',
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '14px', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                borderRadius: '8px',
                border: '1px solid rgba(212,175,55,0.18)',
                textDecoration: 'none',
                transition: 'border-color 0.3s ease',
              }}
            >
              {hero.ctaSecondary || 'Contact via WhatsApp'}
            </Link>
          </div>

          {/* Badges */}
          <div ref={badgesRef} className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 opacity-0">
            {badges.map((badge, i) => (
              <div key={i} className="flex items-center gap-5">
                <span style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(11px, 0.85vw, 14px)',
                  color: 'rgba(212,175,55,0.4)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 400,
                }}>
                  {badge}
                </span>
                {i < badges.length - 1 && (
                  <span style={{
                    width: '3px', height: '3px', borderRadius: '50%',
                    background: 'rgba(212,175,55,0.2)', display: 'inline-block', flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Established text at frame bottom ── */}
        <div
          ref={establishedRef}
          className="absolute bottom-[52px] left-1/2 -translate-x-1/2 opacity-0"
          style={{
            zIndex: 6,
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.3)',
            background: '#1A1510',
            padding: '0 16px',
          }}
        >
          {hero.established || 'EST. ISTANBUL'}
        </div>

        {/* ── Scroll Hint ── */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
          style={{ zIndex: 10 }}
        >
          <span style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.3)',
          }}>
            {hero.scrollHint || 'Scroll to explore'}
          </span>
          <div className="reveal-scroll-line" />
        </div>

        {/* ── Light Bleed (behind doors) ── */}
        <div
          ref={lightBleedRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            zIndex: 14,
            width: '300px', height: '100vh',
            background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, rgba(184,134,11,0.08) 30%, transparent 60%)',
            opacity: 0,
          }}
        />

        {/* ── Door: Left Panel ── */}
        <div
          ref={doorLeftRef}
          className="absolute top-0 left-0 w-1/2 h-full reveal-door"
          style={{
            zIndex: 15,
            background: `
              linear-gradient(135deg, #1C1814 0%, #2A2420 30%, #1E1A16 50%, #252018 70%, #1C1814 100%)
            `,
          }}
        >
          {/* Brushed texture overlay */}
          <div className="absolute inset-0 reveal-brushed" style={{ opacity: 0.4 }} />
          {/* Noise overlay */}
          <div className="absolute inset-0 reveal-door-grain" style={{ opacity: 0.08 }} />
          {/* Inner edge highlight */}
          <div
            className="absolute top-0 right-0 w-[1px] h-full"
            style={{ background: 'linear-gradient(to bottom, transparent 10%, rgba(212,175,55,0.15) 50%, transparent 90%)' }}
          />
        </div>

        {/* ── Door: Right Panel ── */}
        <div
          ref={doorRightRef}
          className="absolute top-0 right-0 w-1/2 h-full reveal-door"
          style={{
            zIndex: 15,
            background: `
              linear-gradient(225deg, #1C1814 0%, #2A2420 30%, #1E1A16 50%, #252018 70%, #1C1814 100%)
            `,
          }}
        >
          <div className="absolute inset-0 reveal-brushed" style={{ opacity: 0.4 }} />
          <div className="absolute inset-0 reveal-door-grain" style={{ opacity: 0.08 }} />
          {/* Inner edge highlight */}
          <div
            className="absolute top-0 left-0 w-[1px] h-full"
            style={{ background: 'linear-gradient(to bottom, transparent 10%, rgba(212,175,55,0.15) 50%, transparent 90%)' }}
          />
        </div>

        {/* ── Gold Seam (center) ── */}
        <div
          ref={seamRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 h-full"
          style={{
            zIndex: 16,
            width: '2px',
            background: 'linear-gradient(to bottom, transparent 5%, rgba(212,175,55,0.6) 30%, rgba(245,225,164,0.9) 50%, rgba(212,175,55,0.6) 70%, transparent 95%)',
            boxShadow: '0 0 30px rgba(212,175,55,0.5), 0 0 80px rgba(212,175,55,0.2)',
            opacity: 0.5,
          }}
        />

        {/* ── Film Grain ── */}
        <div
          ref={grainRef}
          className="absolute inset-0 pointer-events-none reveal-grain opacity-0"
          style={{ zIndex: 7 }}
        />

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 6,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(26,21,16,0.6) 100%)',
          }}
        />

        {/* No fallback overlay needed — the door panels themselves cover the viewport initially */}
      </section>

      <style jsx>{`
        /* ── Brushed metal texture ── */
        .reveal-brushed {
          background: repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(255,255,255,0.01) 1px,
            transparent 2px,
            transparent 4px
          );
        }

        /* ── Door grain ── */
        .reveal-door-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: overlay;
        }

        /* ── Decorative frame with shimmer border ── */
        .reveal-frame {
          border: 1px solid rgba(212,175,55,0.12);
          background: transparent;
          box-shadow: inset 0 0 60px rgba(212,175,55,0.02);
        }
        .reveal-frame::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          border: 1px solid transparent;
          background: linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.3) 25%, rgba(245,225,164,0.5) 50%, rgba(212,175,55,0.3) 75%, transparent 100%) border-box;
          background-size: 300% 100%;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: frameShimmer 6s linear infinite;
        }

        @keyframes frameShimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* ── Shimmer Rule ── */
        .reveal-shimmer-rule {
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
          animation: revealShimmer 3.5s ease-in-out infinite;
        }
        @keyframes revealShimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        /* ── Film Grain ── */
        .reveal-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: overlay;
        }

        /* ── Scroll Line ── */
        .reveal-scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, rgba(212,175,55,0.3), transparent);
          animation: revealScrollPulse 2.5s ease-in-out infinite;
        }
        @keyframes revealScrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.5); transform-origin: top; }
          50%      { opacity: 0.7; transform: scaleY(1); transform-origin: top; }
        }

        /* ── SplitText line overflow ── */
        :global(.reveal-line) {
          overflow: hidden;
        }

        /* ── Door transition smoothness ── */
        .reveal-door {
          will-change: transform, filter;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
}
