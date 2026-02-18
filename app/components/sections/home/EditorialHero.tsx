'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface EditorialHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

export default function EditorialHero({ locale, dict }: EditorialHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  const sectionRef = useRef<HTMLElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const estRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const charsRef = useRef<Element[]>([]);
  const [contentVisible, setContentVisible] = useState(false);

  // ── Cursor proximity: headline letter color shift ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !charsRef.current.length) return;

    const handleMove = (e: MouseEvent) => {
      if (!window.gsap) return;
      const chars = charsRef.current;
      if (!chars.length) return;

      chars.forEach((char) => {
        const el = char as HTMLElement;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);

        if (dist < 200) {
          const t = 1 - dist / 200;
          // Interpolate from champagne (#F5E1A4) to bright gold (#D4AF37)
          const r = Math.round(245 + (212 - 245) * t);
          const g = Math.round(225 + (175 - 225) * t);
          const b = Math.round(164 + (55 - 164) * t);
          window.gsap.to(el, { color: `rgb(${r},${g},${b})`, duration: 0.6, ease: 'power2.out' });
        } else {
          window.gsap.to(el, { color: '#F5E1A4', duration: 0.8, ease: 'power2.out' });
        }
      });

      // Subtle cursor glow
      if (glowRef.current) {
        const rect = section.getBoundingClientRect();
        glowRef.current.style.left = `${e.clientX - rect.left}px`;
        glowRef.current.style.top = `${e.clientY - rect.top}px`;
        glowRef.current.style.opacity = '1';
      }
    };

    const handleLeave = () => {
      if (!window.gsap) return;
      charsRef.current.forEach((char) => {
        window.gsap.to(char as HTMLElement, { color: '#F5E1A4', duration: 1, ease: 'power2.out' });
      });
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);
    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
    };
  }, [gsapReady, contentVisible]);

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
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // ── GSAP: minimal, precise entrance + scroll ──
  useEffect(() => {
    if (!gsapReady || hasAnimated.current) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;
    if (!gsap || !ScrollTrigger || !SplitText) return;

    hasAnimated.current = true;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Phase 1: Entire composition fades in — one clean breath
      tl.fromTo(compositionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: 'power2.out' },
        0
      );

      tl.call(() => setContentVisible(true), [], 0.3);

      // Phase 2: Headline words settle into position (barely perceptible)
      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: 'chars,words,lines', linesClass: 'editorial-line' });
        charsRef.current = split.chars || [];

        tl.fromTo(split.words,
          { y: 10, opacity: 0.7 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power2.out' },
          0.4
        );
      }

      // Phase 3: Right column settles in
      tl.fromTo(rightColRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
        0.7
      );

      // Bottom line
      tl.fromTo(bottomLineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' },
        0.9
      );

      // ── Scroll: differential parallax ──
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self: { progress: number }) => {
            const p = self.progress;

            // Left column rises faster
            if (leftColRef.current) {
              gsap.set(leftColRef.current, {
                y: p * -100,
                opacity: Math.max(0, 1 - p * 2),
              });
            }

            // Right column rises slower — creates depth
            if (rightColRef.current) {
              gsap.set(rightColRef.current, {
                y: p * -60,
                opacity: Math.max(0, 1 - p * 2.2),
              });
            }

            // Bottom line stays longest
            if (bottomLineRef.current) {
              gsap.set(bottomLineRef.current, {
                opacity: Math.max(0, 1 - p * 3),
              });
            }
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
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
          background: '#0E0B08',
        }}
      >
        {/* ── Static background: warm radial + grain ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 70% 30%, rgba(139,90,43,0.05) 0%, transparent 55%)',
          }}
        />
        <div className="absolute inset-0 editorial-grain" style={{ opacity: 0.04 }} />

        {/* ── Cursor glow (barely visible) ── */}
        <div
          ref={glowRef}
          className="absolute pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(212,175,55,0.025) 0%, transparent 50%)',
            borderRadius: '50%',
            opacity: 0,
            transition: 'opacity 0.6s ease',
            zIndex: 1,
          }}
        />

        {/* ── The Composition ── */}
        <div
          ref={compositionRef}
          className="relative h-full opacity-0"
          style={{ zIndex: 2 }}
        >
          {/* Editorial grid */}
          <div className="h-full flex flex-col lg:flex-row items-stretch" style={{ padding: 'clamp(40px, 5vh, 80px) clamp(24px, 5vw, 80px)' }}>

            {/* ── Left Column: Typography ── */}
            <div
              ref={leftColRef}
              className="flex flex-col justify-center lg:w-[60%] flex-shrink-0"
              style={{ paddingRight: 'clamp(20px, 4vw, 80px)' }}
            >
              {/* Kicker */}
              <div
                ref={kickerRef}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(10px, 0.7vw, 12px)',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.55)',
                  marginBottom: 'clamp(20px, 3vh, 40px)',
                }}
              >
                {hero.kicker || 'Transformative Aesthetic Mastery'}
              </div>

              {/* MASSIVE Headline */}
              <div
                ref={headlineRef}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(56px, 8vw, 130px)',
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: '-0.03em',
                  color: '#F5E1A4',
                  marginBottom: 'clamp(24px, 3vh, 40px)',
                }}
              >
                <div>{hero.headlineLine1 || 'Precision.'}</div>
                <div>{hero.headlineLine2 || 'Elegance.'}</div>
                <div>{hero.headlineLine3 || 'You.'}</div>
              </div>

              {/* Static gold rule */}
              <div
                ref={ruleRef}
                style={{
                  width: '80px',
                  height: '1px',
                  background: 'rgba(212,175,55,0.4)',
                  marginBottom: 'clamp(20px, 2.5vh, 32px)',
                }}
              />

              {/* Subheadline */}
              <p
                ref={subRef}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(15px, 1.1vw, 18px)',
                  lineHeight: 1.7,
                  color: 'rgba(245,225,164,0.5)',
                  maxWidth: '440px',
                  fontWeight: 300,
                }}
              >
                {hero.subheadline || 'World-class aesthetic surgery and wellness, delivered with uncompromising care in Istanbul.'}
              </p>
            </div>

            {/* ── Right Column: Supporting Content ── */}
            <div
              ref={rightColRef}
              className="flex flex-col justify-center lg:w-[35%] mt-10 lg:mt-0 opacity-0"
              style={{ paddingLeft: 'clamp(0px, 2vw, 40px)' }}
            >
              {/* Trust badge card */}
              <div
                ref={cardRef}
                style={{
                  background: 'rgba(212,175,55,0.03)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(212,175,55,0.08)',
                  borderRadius: '12px',
                  padding: 'clamp(24px, 2.5vw, 36px)',
                  marginBottom: 'clamp(24px, 3vh, 36px)',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(212,175,55,0.4)',
                    marginBottom: '20px',
                    paddingBottom: '12px',
                    borderBottom: '1px solid rgba(212,175,55,0.06)',
                  }}
                >
                  Why patients trust us
                </div>
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 0',
                      borderBottom: i < badges.length - 1 ? '1px solid rgba(212,175,55,0.05)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: 'rgba(212,175,55,0.35)',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(13px, 0.9vw, 14px)',
                        color: 'rgba(245,225,164,0.55)',
                        fontWeight: 400,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA buttons — stacked vertically */}
              <div ref={ctaRef} className="flex flex-col gap-3" style={{ marginBottom: 'clamp(28px, 3.5vh, 48px)' }}>
                <Link
                  href={`/${locale}/contact`}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '15px 28px',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                    color: '#0E0B08',
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 20px rgba(212,175,55,0.2)',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  {hero.ctaPrimary || 'Book Your Consultation'}
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '15px 28px',
                    background: 'transparent',
                    color: 'rgba(212,175,55,0.6)',
                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    borderRadius: '8px',
                    border: '1px solid rgba(212,175,55,0.15)',
                    textDecoration: 'none',
                    transition: 'border-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  {hero.ctaSecondary || 'Contact via WhatsApp'}
                </Link>
              </div>

              {/* Established */}
              <div
                ref={estRef}
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '9px',
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(212,175,55,0.25)',
                }}
              >
                {hero.established || 'EST. ISTANBUL'}
              </div>
            </div>
          </div>

          {/* ── Bottom gold line with stats ── */}
          <div
            ref={bottomLineRef}
            className="absolute left-0 right-0 opacity-0"
            style={{
              bottom: '10%',
              zIndex: 3,
            }}
          >
            <div style={{ height: '1px', background: 'rgba(212,175,55,0.08)', width: '100%' }} />
          </div>
        </div>

        {/* ── Vignette (very subtle) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 3,
            background: 'radial-gradient(ellipse at center, transparent 60%, rgba(14,11,8,0.5) 100%)',
          }}
        />

        {/* ── Visibility fallback ── */}
        {!contentVisible && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10, background: '#0E0B08' }} />
        )}
      </section>

      <style jsx>{`
        .editorial-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px 128px;
          mix-blend-mode: overlay;
        }

        :global(.editorial-line) {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
