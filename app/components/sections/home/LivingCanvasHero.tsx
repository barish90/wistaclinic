'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface LivingCanvasHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ═══════════════════════════════════════════
   Simplex-inspired 2D noise (self-contained)
   ═══════════════════════════════════════════ */
const PERM = new Uint8Array(512);
const GRAD = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];
(() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

function noise2D(x: number, y: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const g00 = GRAD[PERM[PERM[xi] + yi] & 7];
  const g10 = GRAD[PERM[PERM[xi + 1] + yi] & 7];
  const g01 = GRAD[PERM[PERM[xi] + yi + 1] & 7];
  const g11 = GRAD[PERM[PERM[xi + 1] + yi + 1] & 7];

  const n00 = g00[0] * xf + g00[1] * yf;
  const n10 = g10[0] * (xf - 1) + g10[1] * yf;
  const n01 = g01[0] * xf + g01[1] * (yf - 1);
  const n11 = g11[0] * (xf - 1) + g11[1] * (yf - 1);

  const nx0 = n00 + u * (n10 - n00);
  const nx1 = n01 + u * (n11 - n01);
  return nx0 + v * (nx1 - nx0);
}

/* ═══════════════════════════════════
   Color palette by position
   ═══════════════════════════════════ */
const PALETTE = [
  { r: 212, g: 175, b: 55 },   // gold
  { r: 245, g: 225, b: 164 },  // champagne
  { r: 184, g: 134, b: 11 },   // deep gold
  { r: 196, g: 133, b: 106 },  // rose-bronze
  { r: 139, g: 90, b: 43 },    // amber
  { r: 255, g: 248, b: 231 },  // cream
];

function getColorForPosition(x: number, y: number, w: number, h: number) {
  const nx = x / w;
  const ny = y / h;
  const distCenter = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2);

  // Center: warm gold/champagne. Edges: deeper amber. Corners: rose-bronze
  let idx: number;
  if (distCenter < 0.25) {
    idx = Math.random() < 0.6 ? 0 : 1; // gold or champagne
  } else if (distCenter < 0.45) {
    idx = Math.random() < 0.5 ? 2 : 0; // deep gold or gold
  } else {
    const corner = (nx < 0.3 || nx > 0.7) && (ny < 0.3 || ny > 0.7);
    idx = corner ? (Math.random() < 0.5 ? 3 : 4) : (Math.random() < 0.4 ? 4 : 2);
  }
  const c = PALETTE[idx];
  return c;
}

/* ═══════════════════════════════════
   Particle
   ═══════════════════════════════════ */
interface Trail { x: number; y: number }

class Particle {
  x: number; y: number;
  vx = 0; vy = 0;
  r: number; g: number; b: number;
  alpha: number;
  trail: Trail[] = [];
  maxTrail: number;
  size: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    const c = getColorForPosition(this.x, this.y, w, h);
    this.r = c.r; this.g = c.g; this.b = c.b;
    this.alpha = 0.15 + Math.random() * 0.45;
    this.maxTrail = 5 + Math.floor(Math.random() * 10);
    this.size = 1 + Math.random() * 1.5;
  }

  reset(w: number, h: number) {
    // Re-enter from random edge
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) { this.x = 0; this.y = Math.random() * h; }
    else if (edge === 1) { this.x = w; this.y = Math.random() * h; }
    else if (edge === 2) { this.x = Math.random() * w; this.y = 0; }
    else { this.x = Math.random() * w; this.y = h; }
    this.trail = [];
    const c = getColorForPosition(this.x, this.y, w, h);
    this.r = c.r; this.g = c.g; this.b = c.b;
  }
}

/* ═══════════════════════════
   Attractors
   ═══════════════════════════ */
const ATTRACTORS = [
  { x: 0.5, y: 0.42, strength: 0.3 },   // near headline
  { x: 0.25, y: 0.65, strength: 0.2 },   // lower-left
  { x: 0.78, y: 0.3, strength: 0.2 },    // upper-right
];

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */
export default function LivingCanvasHero({ locale, dict }: LivingCanvasHeroProps) {
  const { gsapReady } = useGsap();
  const hero = dict?.home?.hero || {};

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kickerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasAnimated = useRef(false);
  const [contentVisible, setContentVisible] = useState(false);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollSpeedRef = useRef(1); // 1 = full speed, 0 = frozen
  const globalAlphaRef = useRef(0); // ramps 0→1 during entrance
  const animFrameRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  // ── Canvas flow field ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let w = section.clientWidth;
    let h = section.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    // Particle count — fewer on mobile
    const count = w < 768 ? 600 : 1000;
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) particles.push(new Particle(w, h));
    particlesRef.current = particles;

    const NOISE_SCALE = 0.003;
    let time = 0;

    // Mouse tracking
    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseleave', handleLeave);

    // Resize
    const handleResize = () => {
      w = section.clientWidth;
      h = section.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const loop = () => {
      const speed = scrollSpeedRef.current;
      const gAlpha = globalAlphaRef.current;

      // Clear with dark base (slight trail persistence)
      ctx.fillStyle = `rgba(13, 10, 7, ${0.15 + (1 - speed) * 0.85})`;
      ctx.fillRect(0, 0, w, h);

      time += 0.002 * speed;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (speed > 0.01) {
          // Flow field angle
          const angle = noise2D(p.x * NOISE_SCALE + time, p.y * NOISE_SCALE + time) * Math.PI * 2;
          const flowSpeed = 1.2 * speed;
          p.vx += Math.cos(angle) * flowSpeed * 0.15;
          p.vy += Math.sin(angle) * flowSpeed * 0.15;

          // Attractors
          for (const a of ATTRACTORS) {
            const ax = a.x * w;
            const ay = a.y * h;
            const dx = ax - p.x;
            const dy = ay - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 250 && dist > 1) {
              const force = a.strength * speed / dist;
              p.vx += dx * force * 0.3;
              p.vy += dy * force * 0.3;
            }
          }

          // Cursor attraction
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          if (mx > -999) {
            const dx = mx - p.x;
            const dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150 && dist > 1) {
              const force = (1 - dist / 150) * 0.8 * speed;
              p.vx += dx * force * 0.04;
              p.vy += dy * force * 0.04;
            }
          }

          // Damping
          p.vx *= 0.92;
          p.vy *= 0.92;

          // Update position
          p.x += p.vx;
          p.y += p.vy;

          // Trail
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > p.maxTrail) p.trail.shift();

          // Bounds
          if (p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
            p.reset(w, h);
          }
        }

        // Render trail
        const alpha = p.alpha * gAlpha;
        if (alpha < 0.01) continue;

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${alpha * 0.3 * speed})`;
          ctx.lineWidth = p.size * 0.6;
          ctx.stroke();
        }

        // Render particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      globalAlphaRef.current = 1;
      hasAnimated.current = true;
    }
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        setContentVisible(true);
        globalAlphaRef.current = 1;
        hasAnimated.current = true;
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  // ── GSAP entrance + scroll ──
  useEffect(() => {
    if (!gsapReady || hasAnimated.current) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const CustomEase = window.CustomEase;
    if (!gsap || !ScrollTrigger || !SplitText || !CustomEase) return;

    hasAnimated.current = true;
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
    CustomEase.create('canvasRise', 'M0,0 C0.12,0.7 0.3,1 1,1');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'canvasRise' } });

      // Particles fade in (ramp globalAlpha)
      tl.to(globalAlphaRef, { current: 1, duration: 2.5, ease: 'power2.inOut' }, 0);

      // Content entrance
      tl.fromTo(kickerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1 },
        1.2
      );

      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, { type: 'words,lines', linesClass: 'canvas-line' });
        tl.fromTo(split.words,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.1, stagger: 0.1, ease: 'canvasRise' },
          1.5
        );
      }

      tl.fromTo(ruleRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1, ease: 'canvasRise' },
        2.2
      );

      tl.fromTo(subRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9 },
        2.4
      );

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.9 },
        2.6
      );

      tl.fromTo(badgesRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8 },
        2.8
      );

      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 0.5, duration: 0.7 },
        3.1
      );

      tl.call(() => setContentVisible(true), [], 1.5);

      // ── Scroll: freeze the flow ──
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.5,
          onUpdate: (self: { progress: number }) => {
            const p = self.progress;

            // Flow speed decreases to 0
            scrollSpeedRef.current = Math.max(0, 1 - p * 2);

            // Global alpha fades out
            if (p > 0.4) {
              globalAlphaRef.current = Math.max(0, 1 - (p - 0.4) * 2.5);
            }

            // Content slides up and fades
            const contentEls = [kickerRef, headlineRef, ruleRef, subRef, ctaRef, badgesRef];
            contentEls.forEach((ref, i) => {
              if (ref.current) {
                gsap.set(ref.current, {
                  y: p * -(80 + i * 15),
                  opacity: Math.max(0, 1 - p * 2.5),
                });
              }
            });
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
        style={{ height: '100vh', minHeight: '700px', background: '#0D0A07' }}
      >
        {/* ── Canvas ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        />

        {/* ── Subtle readability gradient behind content ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: 'radial-gradient(ellipse at 50% 45%, rgba(13,10,7,0.5) 0%, transparent 55%)',
          }}
        />

        {/* ── Content ── */}
        <div
          className="relative flex flex-col items-center justify-center text-center h-full px-6"
          style={{ zIndex: 3 }}
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
            className="canvas-shimmer-rule opacity-0"
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
                color: '#0D0A07',
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

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(13,10,7,0.7) 100%)',
          }}
        />

        {/* ── Scroll Hint ── */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
          style={{ zIndex: 5 }}
        >
          <span style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.3)',
          }}>
            {hero.scrollHint || 'Scroll to explore'}
          </span>
          <div className="canvas-scroll-line" />
        </div>

        {/* ── Visibility fallback ── */}
        {!contentVisible && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10, background: '#0D0A07' }} />
        )}
      </section>

      <style jsx>{`
        .canvas-shimmer-rule {
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
          animation: canvasShimmer 3.5s ease-in-out infinite;
        }
        @keyframes canvasShimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        .canvas-scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, rgba(212,175,55,0.3), transparent);
          animation: canvasScrollPulse 2.5s ease-in-out infinite;
        }
        @keyframes canvasScrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.5); transform-origin: top; }
          50%      { opacity: 0.7; transform: scaleY(1); transform-origin: top; }
        }

        :global(.canvas-line) {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
