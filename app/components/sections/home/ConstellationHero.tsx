'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useGsap } from '@/app/hooks/useGsap';

interface ConstellationHeroProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

// ════════════════════════════════════════════════════════
// CONSTELLATION DATA — Precision network in a 1000×600 field
// Three concentric rings of nodes connected by gold threads
// ════════════════════════════════════════════════════════

const NODES = [
  // ── Central origin — the first point of light ──
  { id: 0, x: 500, y: 300, layer: 2, r: 3 },

  // ── Inner hexagon (layer 2) — surgical precision ──
  { id: 1, x: 425, y: 232, layer: 2, r: 2.2 },
  { id: 2, x: 575, y: 232, layer: 2, r: 2.2 },
  { id: 3, x: 635, y: 310, layer: 2, r: 2 },
  { id: 4, x: 575, y: 390, layer: 2, r: 2 },
  { id: 5, x: 425, y: 390, layer: 2, r: 2 },
  { id: 6, x: 365, y: 310, layer: 2, r: 2.2 },

  // ── Middle ring (layer 1) — expansion ──
  { id: 7, x: 305, y: 158, layer: 1, r: 1.8 },
  { id: 8, x: 462, y: 122, layer: 1, r: 1.6 },
  { id: 9, x: 648, y: 132, layer: 1, r: 1.6 },
  { id: 10, x: 762, y: 235, layer: 1, r: 1.8 },
  { id: 11, x: 750, y: 395, layer: 1, r: 1.6 },
  { id: 12, x: 638, y: 480, layer: 1, r: 1.6 },
  { id: 13, x: 460, y: 490, layer: 1, r: 1.8 },
  { id: 14, x: 312, y: 440, layer: 1, r: 1.6 },
  { id: 15, x: 232, y: 345, layer: 1, r: 1.6 },
  { id: 16, x: 248, y: 205, layer: 1, r: 1.8 },

  // ── Outer ring (layer 0) — the frontier ──
  { id: 17, x: 135, y: 88, layer: 0, r: 1.5 },
  { id: 18, x: 372, y: 42, layer: 0, r: 1.2 },
  { id: 19, x: 675, y: 48, layer: 0, r: 1.2 },
  { id: 20, x: 868, y: 155, layer: 0, r: 1.5 },
  { id: 21, x: 908, y: 365, layer: 0, r: 1.2 },
  { id: 22, x: 805, y: 525, layer: 0, r: 1.5 },
  { id: 23, x: 555, y: 560, layer: 0, r: 1.2 },
  { id: 24, x: 345, y: 550, layer: 0, r: 1.2 },
  { id: 25, x: 148, y: 490, layer: 0, r: 1.5 },
  { id: 26, x: 98, y: 335, layer: 0, r: 1.2 },
  { id: 27, x: 105, y: 195, layer: 0, r: 1.2 },
] as const;

// Badge labels anchored to outer nodes
const BADGE_ANCHORS = [
  { nodeId: 17, dx: -58, dy: -28, anchor: 'end' },
  { nodeId: 20, dx: 58, dy: -22, anchor: 'start' },
  { nodeId: 22, dx: 58, dy: 28, anchor: 'start' },
  { nodeId: 25, dx: -58, dy: 28, anchor: 'end' },
] as const;

// Edges by drawing wave — center outward
const W1_EDGES: number[][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
];
const W2_EDGES: number[][] = [
  [1, 7], [1, 8], [2, 8], [2, 9], [3, 10], [4, 11],
  [4, 12], [5, 13], [5, 14], [6, 15], [6, 16], [1, 16],
  [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
  [12, 13], [13, 14], [14, 15], [15, 16], [16, 7],
];
const W3_EDGES: number[][] = [
  [7, 17], [8, 18], [9, 19], [9, 20], [10, 20],
  [10, 21], [11, 22], [12, 22], [12, 23], [13, 24],
  [14, 25], [15, 25], [15, 26], [16, 27], [17, 27],
  [17, 18], [19, 20], [21, 22], [23, 24], [25, 26], [26, 27],
];

// Nodes that pulse for ambient life
const PULSE_IDS = new Set([0, 2, 5, 8, 11, 14, 17, 20, 22, 25]);

export default function ConstellationHero({ locale, dict }: ConstellationHeroProps) {
  const { gsapReady } = useGsap();

  // ── Refs ──
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linesRef = useRef<SVGGElement>(null);
  const nodesL0Ref = useRef<SVGGElement>(null);
  const nodesL1Ref = useRef<SVGGElement>(null);
  const nodesL2Ref = useRef<SVGGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // ── Parallax mouse tracking ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };

      if (!window.gsap) return;
      const dx = mouseRef.current.x - 0.5;
      const dy = mouseRef.current.y - 0.5;

      // Each layer drifts at different speed — creates parallax depth
      if (nodesL0Ref.current) {
        window.gsap.to(nodesL0Ref.current, {
          x: dx * 6, y: dy * 4, duration: 2.0, ease: 'power3.out',
        });
      }
      if (nodesL1Ref.current) {
        window.gsap.to(nodesL1Ref.current, {
          x: dx * 12, y: dy * 8, duration: 1.5, ease: 'power3.out',
        });
      }
      if (nodesL2Ref.current) {
        window.gsap.to(nodesL2Ref.current, {
          x: dx * 20, y: dy * 14, duration: 1.0, ease: 'power3.out',
        });
      }

      // Cursor glow
      if (cursorGlowRef.current) {
        window.gsap.to(cursorGlowRef.current, {
          left: e.clientX - rect.left,
          top: e.clientY - rect.top,
          duration: 1.2,
          ease: 'power3.out',
        });
      }
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

  // ── Fallbacks ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      [kickerRef, headlineRef, subRef, ctaRef, scrollRef].forEach((r) => {
        if (r.current) r.current.style.opacity = '1';
      });
      if (svgRef.current) svgRef.current.style.opacity = '1';
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAnimated.current) {
        [kickerRef, headlineRef, subRef, ctaRef, scrollRef].forEach((r) => {
          if (r.current) r.current.style.opacity = '1';
        });
        if (svgRef.current) svgRef.current.style.opacity = '1';
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // ════════════════════════════════════════════════════════
  // GSAP — CONSTELLATION OF PRECISION
  // The precision of a Swiss watch mechanism being assembled
  // ════════════════════════════════════════════════════════
  useEffect(() => {
    if (!gsapReady) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const gsap = window.gsap;
    const ST = window.ScrollTrigger;
    const SplitText = window.SplitText;
    const DrawSVG = window.DrawSVGPlugin;
    const CE = window.CustomEase;

    if (!gsap || !ST || !SplitText || !DrawSVG) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      // ── Custom eases ──
      if (CE) {
        CE.create('cinematic', 'M0,0 C0.08,0.82 0.17,1 1,1');
        CE.create('dramatic', 'M0,0 C0.23,1 0.32,1 1,1');
        CE.create('silk', 'M0,0 C0.25,0.1 0.25,1 1,1');
        CE.create('precision', 'M0,0 C0.5,0 0.5,1 1,1');
      }
      const dramatic = CE ? 'dramatic' : 'power3.out';
      const silk = CE ? 'silk' : 'power2.out';
      const precision = CE ? 'precision' : 'power2.inOut';

      const master = gsap.timeline();

      // ════════════════════════════════════════
      // ACT I — THE FIRST POINT OF LIGHT
      // From absolute void, a single luminous point
      // ════════════════════════════════════════

      if (svgRef.current) {
        master.fromTo(svgRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0);
      }

      // Central node — origin of all precision
      master.fromTo(
        '.node-center',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'back.out(3)' },
        0.3
      );
      master.fromTo(
        '.glow-center',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' },
        0.3
      );

      // ════════════════════════════════════════
      // ACT II — THE NETWORK UNFOLDS
      // Lines draw from center outward in three waves
      // Each node pulses to life when its lines arrive
      // ════════════════════════════════════════

      // Wave 1: Inner hexagon — the core architecture
      master.fromTo(
        '.w1-line',
        { drawSVG: '50% 50%' },
        { drawSVG: '0% 100%', duration: 1.0, stagger: 0.045, ease: precision },
        0.8
      );
      master.fromTo(
        '.w1-node',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(2.5)' },
        1.2
      );
      master.fromTo(
        '.w1-glow',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power2.out' },
        1.2
      );

      // Wave 2: Middle ring — the structure deepens
      master.fromTo(
        '.w2-line',
        { drawSVG: '50% 50%' },
        { drawSVG: '0% 100%', duration: 0.8, stagger: 0.028, ease: precision },
        1.7
      );
      master.fromTo(
        '.w2-node',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: 'back.out(2)' },
        2.1
      );
      master.fromTo(
        '.w2-glow',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.04, ease: 'power2.out' },
        2.1
      );

      // Wave 3: Outer frontier — the constellation reaches its limit
      master.fromTo(
        '.w3-line',
        { drawSVG: '50% 50%' },
        { drawSVG: '0% 100%', duration: 0.7, stagger: 0.022, ease: precision },
        2.5
      );
      master.fromTo(
        '.w3-node',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.028, ease: 'back.out(2)' },
        2.8
      );
      master.fromTo(
        '.w3-glow',
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.028, ease: 'power2.out' },
        2.8
      );

      // Badge connector lines draw to their labels
      master.fromTo(
        '.badge-connector',
        { drawSVG: '0% 0%' },
        { drawSVG: '0% 100%', duration: 0.5, stagger: 0.1, ease: silk },
        3.1
      );
      master.fromTo(
        '.badge-label',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power1.out' },
        3.3
      );

      // ════════════════════════════════════════
      // ACT III — TYPOGRAPHY MATERIALIZES
      // Text emerges from within the constellation
      // ════════════════════════════════════════

      // Kicker — cipher text decode
      if (kickerRef.current) {
        const finalText = kickerRef.current.getAttribute('data-text') || '';
        const cipher = '—·+ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        kickerRef.current.style.opacity = '1';
        const scramble = { progress: 0 };
        master.to(
          scramble,
          {
            progress: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (!kickerRef.current) return;
              const p = scramble.progress;
              const resolved = Math.floor(p * finalText.length);
              let display = '';
              for (let i = 0; i < finalText.length; i++) {
                if (i < resolved) display += finalText[i];
                else if (finalText[i] === ' ') display += ' ';
                else display += cipher[Math.floor(Math.random() * cipher.length)];
              }
              kickerRef.current.textContent = display;
            },
          },
          2.0
        );
      }

      // Headline — chars fade-in synced with constellation expansion
      if (headlineRef.current) {
        headlineRef.current.style.opacity = '1';
        const lineWraps = headlineRef.current.querySelectorAll('.hero-line-wrap');

        lineWraps.forEach((wrap, idx) => {
          const line = wrap.querySelector('.hero-line');
          if (!line) return;

          const split = new SplitText(line, { type: 'chars' });
          const staggerFrom = idx === 0 ? 'start' : idx === 1 ? 'center' : 'end';

          master.fromTo(
            split.chars,
            {
              opacity: 0,
              y: 35,
              filter: 'blur(10px)',
              scale: 0.75,
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
              duration: 0.9,
              stagger: { each: 0.04, from: staggerFrom },
              ease: dramatic,
            },
            2.4 + idx * 0.28
          );
        });
      }

      // Subheadline — word-by-word resolve
      if (subRef.current) {
        subRef.current.style.opacity = '1';
        const subSplit = new SplitText(subRef.current, { type: 'words' });
        master.fromTo(
          subSplit.words,
          { opacity: 0, y: 15, filter: 'blur(6px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.5,
            stagger: 0.035,
            ease: dramatic,
          },
          3.4
        );
      }

      // CTA
      if (ctaRef.current) {
        master.fromTo(
          ctaRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' },
          3.8
        );
      }

      // Scroll indicator
      if (scrollRef.current) {
        master.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: silk },
          4.2
        );

        gsap.to(scrollRef.current.querySelector('.scroll-dot'), {
          y: 24,
          duration: 1.8,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 5,
        });
      }

      // ════════════════════════════════════════
      // AMBIENT — The Living Network
      // Select nodes pulse with subtle gold glow
      // ════════════════════════════════════════
      const pulseTargets = sectionRef.current?.querySelectorAll('.node-pulse');
      if (pulseTargets?.length) {
        gsap.to(pulseTargets, {
          opacity: 0.3,
          scale: 1.5,
          transformOrigin: 'center center',
          duration: 3,
          stagger: { each: 0.6, repeat: -1, yoyo: true },
          ease: 'sine.inOut',
          delay: 5,
        });
      }

      // ════════════════════════════════════════
      // SCROLL — The Constellation Disperses
      // Nodes drift outward, lines thin and fade,
      // the network dissolves into void
      // ════════════════════════════════════════
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.5,
          pin: true,
        },
      });

      // Lines fade first — the connections dissolve
      if (linesRef.current) {
        scrollTl.to(linesRef.current, { opacity: 0, duration: 0.25 }, 0);
      }

      // Nodes disperse by layer — outer drifts farthest
      if (nodesL0Ref.current) {
        scrollTl.to(nodesL0Ref.current, {
          scale: 1.8,
          opacity: 0,
          duration: 0.5,
        }, 0.05);
      }
      if (nodesL1Ref.current) {
        scrollTl.to(nodesL1Ref.current, {
          scale: 1.4,
          opacity: 0,
          duration: 0.45,
        }, 0.1);
      }
      if (nodesL2Ref.current) {
        scrollTl.to(nodesL2Ref.current, {
          scale: 1.2,
          opacity: 0,
          duration: 0.4,
        }, 0.15);
      }

      // Content lifts away with blur
      if (contentRef.current) {
        scrollTl.to(contentRef.current, {
          y: -180,
          opacity: 0,
          filter: 'blur(16px)',
          duration: 0.4,
        }, 0.35);
      }

      // Scroll indicator vanishes immediately
      if (scrollRef.current) {
        scrollTl.to(scrollRef.current, { opacity: 0, duration: 0.08 }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady]);

  const h = dict?.home?.hero ?? {} as Record<string, string>;
  const badgeLabels = [h.badge1 ?? '', h.badge2 ?? '', h.badge3 ?? '', h.badge4 ?? ''];

  // ── Helper: get node by id ──
  const n = (id: number) => NODES[id];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: '#030305' }}
    >
      {/* ── Film grain — nearly invisible texture ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.022,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── Warm radial glow at center — subtle depth ── */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60vw',
          height: '60vh',
          background:
            'radial-gradient(ellipse at center, rgba(212,175,55,0.035) 0%, rgba(184,134,11,0.015) 35%, transparent 60%)',
          filter: 'blur(70px)',
        }}
      />

      {/* ── Cursor-reactive glow ── */}
      <div
        ref={cursorGlowRef}
        className="absolute pointer-events-none z-[3] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 55%)',
          filter: 'blur(45px)',
          left: '50%',
          top: '50%',
        }}
      />

      {/* ════════════════════════════════════════ */}
      {/* THE CONSTELLATION — SVG Network          */}
      {/* A master architect's blueprint in light   */}
      {/* ════════════════════════════════════════ */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ opacity: 0 }}
      >
        <defs>
          {/* Gold gradient for lines */}
          <linearGradient id="cst-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#F5E1A4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.35" />
          </linearGradient>
          {/* Node glow filter */}
          <filter id="cst-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
          {/* Larger glow for center */}
          <filter id="cst-glow-lg" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        {/* ── ALL CONNECTING LINES ── */}
        <g ref={linesRef}>
          {/* Wave 1 — Inner star */}
          {W1_EDGES.map(([a, b], i) => (
            <line
              key={`w1l-${i}`}
              className="w1-line"
              x1={n(a).x}
              y1={n(a).y}
              x2={n(b).x}
              y2={n(b).y}
              stroke="url(#cst-gold)"
              strokeWidth="0.5"
            />
          ))}
          {/* Wave 2 — Middle web */}
          {W2_EDGES.map(([a, b], i) => (
            <line
              key={`w2l-${i}`}
              className="w2-line"
              x1={n(a).x}
              y1={n(a).y}
              x2={n(b).x}
              y2={n(b).y}
              stroke="rgba(212,175,55,0.15)"
              strokeWidth="0.4"
            />
          ))}
          {/* Wave 3 — Outer threads */}
          {W3_EDGES.map(([a, b], i) => (
            <line
              key={`w3l-${i}`}
              className="w3-line"
              x1={n(a).x}
              y1={n(a).y}
              x2={n(b).x}
              y2={n(b).y}
              stroke="rgba(212,175,55,0.1)"
              strokeWidth="0.3"
            />
          ))}

          {/* Badge connector lines */}
          {BADGE_ANCHORS.map((b, i) => {
            const node = n(b.nodeId);
            return (
              <line
                key={`bc-${i}`}
                className="badge-connector"
                x1={node.x}
                y1={node.y}
                x2={node.x + b.dx}
                y2={node.y + b.dy}
                stroke="rgba(212,175,55,0.12)"
                strokeWidth="0.3"
                strokeDasharray="2 3"
              />
            );
          })}
        </g>

        {/* ── NODES BY LAYER — each layer parallaxes independently ── */}

        {/* Layer 0 — Outer frontier */}
        <g ref={nodesL0Ref}>
          {NODES.filter((nd) => nd.layer === 0).map((nd) => (
            <g key={`n0-${nd.id}`}>
              <circle
                className={`w3-glow${PULSE_IDS.has(nd.id) ? ' node-pulse' : ''}`}
                cx={nd.x}
                cy={nd.y}
                r={nd.r * 5}
                fill="rgba(212,175,55,0.06)"
                filter="url(#cst-glow)"
              />
              <circle
                className="w3-node"
                cx={nd.x}
                cy={nd.y}
                r={nd.r}
                fill="#D4AF37"
                fillOpacity="0.45"
              />
            </g>
          ))}

          {/* Badge text labels */}
          {BADGE_ANCHORS.map((b, i) => {
            const node = n(b.nodeId);
            return (
              <text
                key={`bl-${i}`}
                className="badge-label"
                x={node.x + b.dx}
                y={node.y + b.dy + (b.dy > 0 ? 14 : -6)}
                fill="rgba(212,175,55,0.22)"
                fontSize="6.5"
                fontFamily="sans-serif"
                textAnchor={b.anchor}
                letterSpacing="2.5"
                style={{ textTransform: 'uppercase' as const, opacity: 0 }}
              >
                {badgeLabels[i]}
              </text>
            );
          })}
        </g>

        {/* Layer 1 — Middle ring */}
        <g ref={nodesL1Ref}>
          {NODES.filter((nd) => nd.layer === 1).map((nd) => (
            <g key={`n1-${nd.id}`}>
              <circle
                className={`w2-glow${PULSE_IDS.has(nd.id) ? ' node-pulse' : ''}`}
                cx={nd.x}
                cy={nd.y}
                r={nd.r * 4}
                fill="rgba(212,175,55,0.09)"
                filter="url(#cst-glow)"
              />
              <circle
                className="w2-node"
                cx={nd.x}
                cy={nd.y}
                r={nd.r}
                fill="#D4AF37"
                fillOpacity="0.6"
              />
            </g>
          ))}
        </g>

        {/* Layer 2 — Inner core */}
        <g ref={nodesL2Ref}>
          {/* Central node — special treatment */}
          <circle
            className="glow-center node-pulse"
            cx={NODES[0].x}
            cy={NODES[0].y}
            r={14}
            fill="rgba(212,175,55,0.1)"
            filter="url(#cst-glow-lg)"
          />
          <circle
            className="node-center"
            cx={NODES[0].x}
            cy={NODES[0].y}
            r={NODES[0].r}
            fill="#D4AF37"
            fillOpacity="0.9"
          />

          {/* Inner hexagon nodes */}
          {NODES.filter((nd) => nd.layer === 2 && nd.id !== 0).map((nd) => (
            <g key={`n2-${nd.id}`}>
              <circle
                className={`w1-glow${PULSE_IDS.has(nd.id) ? ' node-pulse' : ''}`}
                cx={nd.x}
                cy={nd.y}
                r={nd.r * 3.5}
                fill="rgba(212,175,55,0.12)"
                filter="url(#cst-glow)"
              />
              <circle
                className="w1-node"
                cx={nd.x}
                cy={nd.y}
                r={nd.r}
                fill="#D4AF37"
                fillOpacity="0.75"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* ════════════════════════════════════════ */}
      {/* CONTENT — Emerges from the constellation */}
      {/* ════════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-5xl mx-auto">
          {/* Kicker — cipher decode */}
          <p
            ref={kickerRef}
            data-text={h.kicker}
            className="font-sans text-[10px] md:text-[11px] lg:text-xs uppercase tracking-[0.35em] font-medium mb-7 md:mb-9"
            style={{ color: 'rgba(212,175,55,0.5)', opacity: 0, minHeight: '1.2em' }}
          >
            {h.kicker}
          </p>

          {/* Headline — massive, within the constellation frame */}
          <div ref={headlineRef} className="mb-5 md:mb-7" style={{ opacity: 0 }}>
            {/* Line 1 */}
            <div className="hero-line-wrap overflow-hidden" style={{ paddingBottom: '0.1em' }}>
              <h1
                className="hero-line font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]"
                style={{ color: '#F0EDE8' }}
              >
                {h.headlineLine1}
              </h1>
            </div>
            {/* Line 2 — living gold */}
            <div className="hero-line-wrap overflow-hidden" style={{ paddingBottom: '0.1em' }}>
              <h1 className="hero-line constellation-gold-text font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]">
                {h.headlineLine2}
              </h1>
            </div>
            {/* Line 3 */}
            <div className="hero-line-wrap overflow-hidden" style={{ paddingBottom: '0.1em' }}>
              <h1
                className="hero-line font-serif leading-[0.88] tracking-[-0.035em] text-[3.5rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]"
                style={{ color: '#F0EDE8' }}
              >
                {h.headlineLine3}
              </h1>
            </div>
          </div>

          {/* Subheadline */}
          <p
            ref={subRef}
            className="font-sans text-sm md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-10 md:mb-12"
            style={{ color: 'rgba(240,237,232,0.35)', opacity: 0 }}
          >
            {h.subheadline}
          </p>

          {/* CTA — singular, precise */}
          <div ref={ctaRef} className="flex justify-center" style={{ opacity: 0 }}>
            <Link
              href={`/${locale}/contact`}
              className="group relative inline-flex items-center gap-3 font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] overflow-hidden will-change-transform"
              style={{
                color: '#D4AF37',
                padding: '14px 36px',
                border: '1px solid rgba(212,175,55,0.18)',
                borderRadius: '0',
              }}
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              <span className="relative z-10 font-medium">{h.ctaPrimary}</span>
              <ArrowRight
                size={12}
                className="relative z-10 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500"
              />
              {/* Hover fill */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ backgroundColor: 'rgba(212,175,55,0.06)' }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        style={{ opacity: 0 }}
      >
        <p
          className="font-sans text-[8px] md:text-[9px] uppercase tracking-[0.35em]"
          style={{ color: 'rgba(240,237,232,0.12)' }}
        >
          {h.scrollHint}
        </p>
        <div
          className="relative w-[1px] h-14 overflow-hidden"
          style={{ backgroundColor: 'rgba(140,128,112,0.08)' }}
        >
          <div
            className="scroll-dot absolute top-0 left-0 w-full h-5"
            style={{
              background: 'linear-gradient(to bottom, rgba(212,175,55,0.35), transparent)',
            }}
          />
        </div>
      </div>

      {/* ── Vertical text — ghost presence ── */}
      <div className="hidden lg:block absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 z-20">
        <p
          className="font-sans text-[9px] tracking-[0.5em] uppercase"
          style={{ writingMode: 'vertical-rl', color: 'rgba(240,237,232,0.03)' }}
        >
          {h.established}
        </p>
      </div>

      {/* ── Scoped styles ── */}
      <style jsx>{`
        @keyframes constellation-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .constellation-gold-text {
          background: linear-gradient(
            120deg,
            #8b6508 0%,
            #b8860b 18%,
            #d4af37 35%,
            #f5e1a4 48%,
            #fffbe6 52%,
            #f5e1a4 58%,
            #d4af37 72%,
            #b8860b 88%,
            #8b6508 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: constellation-shimmer 7s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .constellation-gold-text {
            animation: none;
            background-position: 50% 50%;
          }
        }
      `}</style>
    </section>
  );
}
