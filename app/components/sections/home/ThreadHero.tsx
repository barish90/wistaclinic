'use client';

import { useRef, useEffect, useState } from 'react';
import { useGsap } from '@/app/hooks/useGsap';

/* ══════════════════════════════════════════════════════════════
   THE THREAD OF TRANSFORMATION

   Gallery-luxury cinematic hero. Cream background, single
   continuous bronze line drawn progressively on scroll, morphing
   between face → breast → body silhouettes.

   Key design: The LINE DRAWS AS YOU SCROLL. Not on page load.
   On load, only the title + kicker animate in. Scrolling reveals
   the art progressively.
   ══════════════════════════════════════════════════════════════ */

interface ThreadHeroDict {
  home?: {
    hero?: {
      kicker?: string;
      ctaPrimary?: string;
      scrollLabel?: string;
      phases?: {
        face?: { kicker?: string; title1?: string; title2?: string; desc?: string };
        form?: { kicker?: string; title1?: string; title2?: string; desc?: string };
        body?: { kicker?: string; title1?: string; title2?: string; desc?: string };
        cta?: { kicker?: string; title?: string; button?: string };
      };
      trustBadges?: string[];
    };
  };
}

interface ThreadHeroProps {
  locale: string;
  dict: ThreadHeroDict;
}

/* ══════════════════════════════════════════════════════════════
   SVG PATH DATA — Hand-crafted one-line art silhouettes

   All paths in a 500×700 viewBox.
   Face: Elegant profile (forehead→brow→nose→lips→chin→jaw→neck)
   Breast: Abstract flowing double-arc feminine contour
   Body: Full S-curve hip/waist/thigh silhouette

   Paths use cubic beziers (C/S commands) for smooth organic curves.
   ══════════════════════════════════════════════════════════════ */

// ─── Hand-crafted one-line art silhouettes ───
// ─── ViewBox: 500×720. Visually verified via render pipeline.
// ─── MorphSVG with shapeIndex:'auto' handles varying segment counts.

// Face profile — from face1.svg, scaled 2.4× to fill the 500×720 viewBox
const PATH_FACE =
  'M 333.5 176.4 C 325.8 181.7 316.0 183.1 307.4 180.5 C 311.9 180.5 318.2 183.1 322.7 181.9 C 327.0 181.0 331.4 178.6 333.5 174.5 C 337.1 168.5 335.0 160.3 330.6 154.8 C 326.6 149.0 320.3 145.2 315.0 140.4 C 305.4 132.2 298.0 121.4 293.7 109.7 C 292.2 105.8 291.0 101.3 293.2 97.9 C 296.1 93.6 302.3 93.4 306.9 95.5 C 312.9 98.4 317.0 104.4 318.9 110.6 C 320.6 117.1 320.3 123.8 319.4 130.6 C 317.9 141.1 314.3 151.4 309.3 160.8 C 306.9 165.6 304.0 170.2 300.6 174.5 C 299.2 176.2 297.5 177.6 296.3 179.3 C 294.6 181.4 294.2 184.3 292.7 186.5 C 290.8 188.9 288.4 191.0 285.3 191.5 C 284.3 191.8 282.9 191.8 281.9 191.0 C 280.5 189.8 280.7 187.2 282.2 186.0 C 283.8 184.8 286.0 184.8 287.7 185.5 C 289.6 186.2 291.0 187.7 292.2 188.9 C 312.4 208.6 327.8 233.0 337.1 259.7 C 343.1 277.4 348.9 301.0 338.6 318.2 C 338.3 319.0 337.6 319.9 336.9 319.9 C 335.4 319.7 335.2 318.0 335.2 316.8 C 335.2 307.2 334.5 297.4 327.8 290.2 C 321.5 283.4 312.6 279.4 303.8 277.9 C 292.5 276.2 280.7 277.7 269.7 279.8 C 254.3 282.5 239.2 285.8 224.3 289.7 C 222.9 290.2 221.2 290.6 220.7 292.1 C 220.2 293.3 221.2 294.7 222.2 295.4 C 223.4 296.2 224.8 296.4 226.0 296.6 C 249.3 299.5 272.8 296.9 296.1 299.0 C 303.0 299.8 310.2 301.0 316.2 304.3 C 327.8 310.6 330.6 323.3 331.4 335.3 C 331.8 344.9 330.6 355.0 319.8 358.3 C 314.8 360.0 309.0 359.5 303.5 358.8 C 282.9 356.9 261.3 354.7 243.0 344.2 C 241.6 343.4 240.2 342.5 240.2 340.8 C 240.2 339.6 240.9 338.6 242.1 337.9 C 243.0 337.4 244.2 337.4 245.4 337.4 C 269.7 336.5 293.4 348.2 317.4 344.6 C 321.5 344.2 325.8 343.0 329.9 343.9 C 337.1 345.6 338.1 353.8 340.2 359.5 C 342.9 367.2 347.2 373.9 352.2 380.2 C 359.0 388.6 367.1 395.5 375.5 402.2 C 380.3 406.1 385.1 409.9 388.7 414.7 C 392.3 419.8 394.7 426.0 393.3 432.0 C 392.1 437.8 387.5 442.3 382.2 445.2 C 378.2 447.4 373.1 449.0 368.6 449.8 C 365.7 450.2 362.6 449.8 359.7 449.5 C 357.0 449.5 355.6 447.8 354.4 445.7 C 353.7 444.0 353.0 440.9 353.4 439.0 C 353.9 436.8 356.6 435.6 358.5 435.1 C 361.6 433.9 364.7 433.4 367.8 433.4 C 371.0 433.2 374.6 434.2 375.8 437.0 C 377.0 439.9 374.6 443.3 371.9 445.0 C 368.8 447.4 365.4 448.8 362.3 451.2 C 359.2 453.4 356.6 456.5 356.3 460.3 C 355.8 466.1 361.1 470.6 365.2 475.0 C 368.8 479.0 371.9 483.6 373.1 488.6 C 373.8 492.0 373.6 495.6 372.4 498.7 C 371.2 501.8 368.8 504.7 366.9 507.6 C 365.7 509.3 362.6 510.0 360.6 510.5 C 358.2 511.2 355.8 511.7 353.4 512.2 C 342.6 513.8 331.8 514.1 321.0 513.6 C 319.6 513.6 317.9 513.6 316.5 512.6 C 315.0 511.9 314.1 510.2 314.8 508.8 C 315.5 506.9 317.9 506.6 319.8 506.6 C 325.8 507.1 331.6 508.8 337.1 507.1 C 341.2 505.7 344.3 502.8 347.2 499.9 C 350.1 497.3 353.0 494.2 356.8 492.7 C 360.6 491.0 365.4 491.3 368.3 494.4 C 370.0 496.3 370.7 499.4 370.5 502.1 C 370.0 505.4 368.6 508.8 366.4 511.4 C 365.0 512.9 363.3 514.1 362.8 516.0 C 362.1 518.4 363.0 520.8 364.5 522.5 C 365.9 524.4 367.6 526.1 368.8 528.0 C 371.7 533.5 368.6 541.0 363.3 544.1 C 357.8 547.2 350.8 546.5 345.3 543.8 C 339.5 541.4 335.0 536.9 330.4 532.6 C 326.1 528.2 321.8 523.7 316.5 520.3 C 315.5 519.8 314.8 519.4 314.6 518.4 C 314.3 517.4 315.0 516.5 316.0 516.2 C 316.7 515.8 317.7 515.8 318.6 515.8 C 325.1 515.8 331.6 515.8 338.1 515.8 C 341.0 515.8 343.8 515.8 346.7 516.5 C 349.6 517.2 352.5 518.6 354.2 520.8 C 357.3 524.6 356.8 530.2 355.4 534.7 C 353.7 539.3 350.1 543.8 349.4 548.6 C 348.4 553.4 350.8 559.4 352.0 563.8 C 355.1 573.6 359.9 583.7 358.0 594.2 C 356.3 602.4 350.8 609.1 344.1 613.9 C 337.4 619.0 329.7 622.1 322.0 625.0 C 285.8 639.4 250.0 632.6 212.3 623.5 C 189.8 618.0 167.7 610.3 147.8 598.6 C 138.4 592.8 129.8 586.6 122.1 578.9 C 114.9 571.4 108.9 562.1 104.1 553.0 C 103.4 551.8 102.9 550.1 103.8 549.1 C 104.6 548.6 105.5 548.6 106.2 548.9 C 116.3 550.6 125.4 555.6 133.6 561.4 C 141.8 567.4 149.2 574.1 157.1 580.3';

// Breast contour — from breast.svg, scaled 1.875× + shifted down 80px
const PATH_BREAST =
  'M 219.19 144.48 C 217.48 152.73 215.78 160.98 216.04 186.02 C 216.30 211.04 218.54 252.83 214.14 285.39 C 209.75 317.93 198.75 341.27 187.54 356.40 C 176.33 371.56 164.90 378.52 162.75 381.79 C 160.59 385.08 167.68 384.67 179.10 391.33 C 190.50 398.01 241.88 417.41 251.18 438.29 C 260.48 459.18 265.99 481.84 266.38 487.68 C 266.78 493.52 262.05 482.50 261.79 465.14 C 261.53 447.78 265.73 424.06 273.45 404.36 C 281.18 384.63 292.45 368.92 300.83 351.82 C 309.20 334.72 314.71 316.24 323.94 298.95 C 333.19 281.67 346.14 265.54 351.65 254.48 C 357.15 243.42 355.20 237.38 348.64 232.54 C 342.10 227.69 330.96 224.03 322.43 226.92 C 313.89 229.81 308.00 239.24 305.93 248.47 C 303.83 257.70 305.54 266.74 308.94 273.63 C 312.35 280.50 317.45 285.22 325.51 285.03 C 333.58 284.84 344.59 279.72 351.48 271.34 C 358.35 262.97 361.10 251.29 359.79 242.39 C 358.49 233.48 353.11 227.32 345.71 219.01 C 338.31 210.69 328.88 200.20 320.29 186.64 C 311.70 173.09 303.98 156.44 296.04 146.48 C 288.11 136.53 279.99 133.24 270.96 134.82 C 261.93 136.41 251.96 142.81 246.39 156.97 C 240.83 171.12 239.64 193.00 240.88 228.04 C 242.13 263.09 245.79 311.32 249.79 336.86 C 253.78 362.42 258.11 365.28 262.43 363.90 C 266.75 362.54 271.06 356.89 270.36 352.07 C 269.64 347.20 263.86 343.15 259.23 342.56 C 254.56 341.97 251.03 344.84 253.13 364.09 C 255.23 383.36 262.95 418.99 266.89 441.47 C 270.83 463.92 270.96 473.22 272.33 482.78 C 273.70 492.34 276.33 502.18 279.79 508.74 C 283.25 515.28 287.59 518.57 289.23 525.57 C 290.85 532.58 289.80 543.33 290.26 550.73 C 290.71 558.14 292.69 562.19 294.79 558.85 C 296.89 555.52 299.11 544.77 300.03 537.11 C 300.94 529.43 300.54 524.86 299.81 526.09 C 299.10 527.33 298.05 534.43 297.06 543.07 C 296.08 551.71 295.16 561.93 295.74 568.15 C 296.33 574.38 298.43 576.62 300.93 571.89 C 303.41 567.16 306.30 555.52 306.55 548.12 C 306.81 540.70 304.45 537.58 303.74 541.31 C 303.01 545.03 303.91 555.64 305.10 564.63 C 306.28 573.61 307.73 580.94 309.95 584.93 C 312.19 588.93 315.19 589.59 315.71 585.07 C 316.24 580.54 314.26 570.86 312.56 560.10 C 310.85 549.37 309.41 537.58 306.15 526.44 C 302.86 515.31 297.76 504.82 294.88 497.28 C 291.99 489.74 291.34 485.17 292.26 467.20 C 293.18 449.26 295.68 417.94 296.20 395.14 C 296.73 372.34 295.28 358.08 292.99 351.47 C 290.70 344.84 287.55 345.89 287.03 348.44 C 286.50 350.99 288.60 355.06 289.51 355.58 C 290.44 356.11 290.18 353.09 291.68 340.46 C 293.18 327.82 296.45 305.54 298.55 273.89 C 300.65 242.27 301.58 201.23 299.01 174.64 C 296.45 148.06 290.41 135.87 280.08 127.87 C 269.71 119.88 255.04 116.07 243.58 118.43 C 232.13 120.79 221.43 139.64 219.09 143.58';

// Body — from body.svg (Illustrator), scaled to fill 500×720 viewBox
const PATH_BODY =
  'M 205.3 660.0' +
  ' C 195.0 640.9, 184.7 621.8, 183.5 602.9' +
  ' C 182.3 583.9, 190.2 565.2, 202.2 547.4' +
  ' C 214.1 529.7, 230.2 513.0, 240.2 500.8' +
  ' C 250.2 488.5, 254.1 480.6, 255.1 472.4' +
  ' C 256.0 464.2, 253.8 455.7, 244.0 430.0' +
  ' C 234.1 404.2, 216.6 361.2, 210.3 330.2' +
  ' C 204.1 299.3, 209.2 280.4, 214.0 261.2' +
  ' C 218.7 242.0, 223.2 222.5, 226.5 206.1' +
  ' C 229.8 189.6, 231.9 176.1, 226.7 158.9' +
  ' C 221.4 141.6, 208.7 120.5, 196.8 115.3' +
  ' C 184.8 110.0, 173.4 120.5, 171.8 135.8' +
  ' C 170.3 151.1, 178.4 171.2, 188.7 183.4' +
  ' C 199.0 195.7, 211.4 200.1, 218.9 198.2' +
  ' C 226.4 196.2, 229.0 187.8, 226.0 176.0' +
  ' C 223.0 164.3, 214.3 149.3, 206.2 142.3' +
  ' C 198.2 135.3, 190.8 136.4, 189.5 141.6' +
  ' C 188.2 146.9, 192.9 156.4, 200.3 164.7' +
  ' C 207.7 173.0, 217.7 180.1, 235.6 176.2' +
  ' C 253.6 172.2, 279.4 157.2, 294.7 141.1' +
  ' C 309.9 125.1, 314.7 107.9, 312.5 95.7' +
  ' C 310.2 83.4, 301.0 76.1, 291.8 80.4' +
  ' C 282.6 84.7, 273.3 100.8, 262.1 112.9' +
  ' C 250.9 125.1, 237.8 133.2, 225.4 131.5' +
  ' C 213.0 129.8, 201.4 118.2, 201.5 104.4' +
  ' C 201.7 90.6, 213.5 74.5, 230.4 67.2' +
  ' C 247.2 60.0, 269.1 61.6, 286.0 69.0' +
  ' C 302.8 76.3, 314.7 89.5, 321.4 105.3' +
  ' C 328.1 121.0, 329.7 139.4, 321.8 152.6' +
  ' C 313.9 165.7, 296.4 173.6, 280.8 177.2' +
  ' C 265.2 180.7, 251.5 179.8, 237.7 178.9';

// Vertical line — elegant stroke at right edge for CTA phase
// 11 cubic segments matching face/breast count.
const PATH_VERTICAL =
  'M 420 55' +
  ' C 420 112, 420 170, 420 228' +      //  1.
  ' C 420 268, 420 308, 420 348' +      //  2.
  ' C 420 378, 420 408, 420 438' +      //  3.
  ' C 420 460, 420 482, 420 504' +      //  4.
  ' C 420 520, 420 536, 420 552' +      //  5.
  ' C 420 565, 420 578, 420 591' +      //  6.
  ' C 420 602, 420 613, 420 624' +      //  7.
  ' C 420 634, 420 644, 420 654' +      //  8.
  ' C 420 662, 420 670, 420 676' +      //  9.
  ' C 420 680, 420 684, 420 688' +      // 10.
  ' C 420 690, 420 692, 420 694';       // 11.

/* ══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON
   ══════════════════════════════════════════════════════════════ */

function useMagneticButton(ref: React.RefObject<HTMLAnchorElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined' || 'ontouchstart' in window) return;
    const gsap = (window as any).gsap;
    if (!gsap) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        const s = 1 - d / 130;
        xTo(dx * s * 0.3);
        yTo(dy * s * 0.3);
      } else {
        xTo(0); yTo(0);
      }
    };
    const onLeave = () => { xTo(0); yTo(0); };

    window.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref]);
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function ThreadHero({ locale, dict }: ThreadHeroProps) {
  const { gsapReady } = useGsap();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [gsapOwned, setGsapOwned] = useState(false);
  const hasAnimated = useRef(false);

  useMagneticButton(ctaRef);

  /* ── i18n with English fallbacks ── */
  const hero = dict?.home?.hero;
  const phases = hero?.phases;
  const i18n = {
    kicker: hero?.kicker ?? 'JCI-Accredited Aesthetic Surgery in Istanbul',
    ctaPrimary: hero?.ctaPrimary ?? 'Get Your Free Consultation',
    scrollLabel: hero?.scrollLabel ?? 'Scroll to explore',
    face: {
      kicker: phases?.face?.kicker ?? 'The Face',
      title1: phases?.face?.title1 ?? 'Facial',
      title2: phases?.face?.title2 ?? 'Harmonization',
      desc: phases?.face?.desc ?? 'Rhinoplasty, jawline sculpting, and full facial rejuvenation — performed by board-certified surgeons with 3D imaging precision. Natural results that enhance your unique features, not erase them.',
    },
    form: {
      kicker: phases?.form?.kicker ?? 'The Form',
      title1: phases?.form?.title1 ?? 'Breast',
      title2: phases?.form?.title2 ?? 'Contouring',
      desc: phases?.form?.desc ?? 'Augmentation, lift, or reduction — planned with 3D Vectra visualization so you see your results before surgery. Tailored to your anatomy for naturally proportioned, confidence-restoring outcomes.',
    },
    body: {
      kicker: phases?.body?.kicker ?? 'The Silhouette',
      title1: phases?.body?.title1 ?? 'Body',
      title2: phases?.body?.title2 ?? 'Sculpting',
      desc: phases?.body?.desc ?? 'BBL, VASER liposuction, and tummy tuck — advanced body contouring by internationally trained surgeons. Precision sculpting that brings your silhouette into its most confident balance.',
    },
    ctaPhase: {
      kicker: phases?.cta?.kicker ?? 'All-Inclusive Packages \u2022 No Hidden Fees',
      title: phases?.cta?.title ?? 'Your Transformation Starts Here',
      button: phases?.cta?.button ?? 'Get Your Free Consultation',
    },
    trustBadges: hero?.trustBadges ?? ['JCI-Accredited Hospital', 'Board-Certified Surgeons', 'VIP Transfer & 5-Star Hotel', 'Lifetime Aftercare'],
  };

  /* ── GSAP setup ── */
  useEffect(() => {
    if (!gsapReady || hasAnimated.current || !containerRef.current || !pathRef.current) return;
    const gsap = (window as any).gsap;
    const ST = (window as any).ScrollTrigger;
    const MorphSVG = (window as any).MorphSVGPlugin;
    if (!gsap || !ST || !MorphSVG) return;
    gsap.registerPlugin(ST, MorphSVG);
    hasAnimated.current = true;

    const path = pathRef.current;
    const container = containerRef.current;

    /* ── Initial GSAP states — GSAP owns all animated props ── */
    // Set up stroke drawing for face path
    const pathLen = path.getTotalLength();
    gsap.set(path, { opacity: 1, strokeDasharray: pathLen, strokeDashoffset: pathLen });
    gsap.set('.thread-glow-path', { opacity: 0 });
    gsap.set('.thread-kicker', { opacity: 0, y: 10, scale: 0.95, letterSpacing: '0.7em' });
    gsap.set('.thread-title-char', { opacity: 0, y: 50, rotateX: -25, filter: 'blur(4px)' });
    gsap.set('.thread-subtitle-char', { opacity: 0, y: 15, rotateX: -15 });
    gsap.set('.thread-intro-divider', { scaleX: 0, opacity: 0 });
    gsap.set('.thread-intro-btn', { opacity: 0, y: 15, scale: 0.95 });
    gsap.set('.thread-phase-text', { opacity: 0, y: 20 });
    gsap.set('.thread-phase-kicker', { opacity: 0, letterSpacing: '0.7em' });
    gsap.set('.thread-phase-word', { opacity: 0, y: 20 });
    gsap.set('.thread-phase-divider', { width: 0, opacity: 0 });
    gsap.set('.thread-phase-desc', { opacity: 0, y: 25 });
    gsap.set('.thread-cta-wrap', { opacity: 0, y: 25 });
    gsap.set('.thread-cta-word', { opacity: 0, y: 20 });
    gsap.set('.thread-cta-btn', { opacity: 0, scale: 0.9 });
    gsap.set('.thread-cta-badge', { opacity: 0, y: 10 });
    gsap.set('.thread-scroll-hint', { opacity: 0, y: 8 });
    gsap.set('.thread-corner', { opacity: 0 });

    setGsapOwned(true);

    /* ══ ENTRANCE — title + line fade in ══ */
    const intro = gsap.timeline();

    intro.to('.thread-corner', {
      opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1,
    }, 0);

    intro.to('.thread-kicker', {
      opacity: 1, y: 0, scale: 1.0, letterSpacing: '0.35em',
      duration: 1.4, ease: 'power2.out',
    }, 0.3);

    intro.to('.thread-title-char', {
      opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
      duration: 0.85, ease: 'power3.out',
      stagger: { each: 0.08, from: 'start' },
    }, 0.7);

    intro.to('.thread-intro-divider', {
      scaleX: 1, opacity: 0.4, duration: 0.8, ease: 'power2.inOut',
    }, 1.3);

    intro.to('.thread-subtitle-char', {
      opacity: 0.85, y: 0, rotateX: 0,
      duration: 0.7, ease: 'power3.out',
      stagger: { each: 0.05, from: 'start' },
    }, 1.5);

    intro.to('.thread-intro-btn', {
      opacity: 1, y: 0, scale: 1.0,
      duration: 0.8, ease: 'power2.out',
    }, 2.0);

    intro.to('.thread-scroll-hint', {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
    }, 2.2);

    /* ══ SCROLL TIMELINE — MORPH BETWEEN SHAPES ══
       Face is fully visible. On scroll, it smoothly morphs through
       breast → body → vertical silhouettes. No drawing animation,
       just fluid shape transitions with camera + text choreography.
    ══════════════════════════════════════════════════════════════ */

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=350%',
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        onUpdate: (self: any) => {
          const p = self.progress;
          progressRef.current = p;

          // Update progress bar via DOM (no React re-render)
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${p * 100}%`;
          }

          // Fade scroll hint
          const hint = document.querySelector('.thread-scroll-hint') as HTMLElement;
          if (hint) hint.style.opacity = String(Math.max(0, 1 - p * 8));
        },
      },
    });

    /* ─── Fade out intro text ─── */
    scrollTl.to('.thread-intro-text', {
      opacity: 0, y: -30, duration: 0.06, ease: 'power2.in',
    }, 0);

    /* ─── Draw the face path on scroll ─── */
    scrollTl.to(path, {
      strokeDashoffset: 0, duration: 0.20, ease: 'none',
    }, 0.01);

    /* ─── Phase 1 (0–0.28): THE FACE ─── */

    // Perspective: slight zoom
    scrollTl.to('.thread-perspective', {
      scale: 1.06, duration: 0.14, ease: 'power2.inOut',
    }, 0.02);

    // Phase 1 text (appears after drawing starts)
    scrollTl.to('.thread-phase1', { opacity: 1, y: 0, duration: 0.02, ease: 'none' }, 0.05);
    scrollTl.to('.thread-phase1 .thread-phase-kicker', {
      opacity: 1, letterSpacing: '0.3em', duration: 0.04, ease: 'power2.out',
    }, 0.05);
    scrollTl.to('.thread-phase1 .thread-phase-word', {
      opacity: 1, y: 0, duration: 0.04, ease: 'power3.out',
      stagger: 0.015,
    }, 0.06);
    scrollTl.to('.thread-phase1 .thread-phase-divider', {
      width: 64, opacity: 1, duration: 0.04, ease: 'power2.inOut',
    }, 0.08);
    scrollTl.to('.thread-phase1 .thread-phase-desc', {
      opacity: 1, y: 0, duration: 0.04, ease: 'power2.out',
    }, 0.10);
    scrollTl.to('.thread-phase1', {
      opacity: 0, y: -15, duration: 0.04, ease: 'power2.in',
    }, 0.22);

    // Fade in glow once face is mostly drawn
    scrollTl.to('.thread-glow-path', {
      opacity: 0.12, duration: 0.06, ease: 'power2.out',
    }, 0.16);

    /* ─── Morph Face → Breast (~24–30%) ─── */
    // Clear dasharray before morph (so morph path renders fully)
    scrollTl.set(path, { strokeDasharray: 'none', strokeDashoffset: 0 }, 0.23);
    scrollTl.to(path, {
      morphSVG: { shape: PATH_BREAST, shapeIndex: 'auto' },
      duration: 0.08, ease: 'power2.inOut',
    }, 0.24);
    scrollTl.to('.thread-glow-path', {
      morphSVG: { shape: PATH_BREAST, shapeIndex: 'auto' },
      duration: 0.08, ease: 'power2.inOut',
    }, 0.24);

    /* ─── Phase 2 (0.30–0.55): THE BREAST ─── */

    // Camera pivot
    scrollTl.to('.thread-perspective', {
      rotateY: -5, scale: 1.02, duration: 0.12, ease: 'power2.inOut',
    }, 0.30);

    // Phase 2 text
    scrollTl.to('.thread-phase2', { opacity: 1, y: 0, duration: 0.02, ease: 'none' }, 0.34);
    scrollTl.to('.thread-phase2 .thread-phase-kicker', {
      opacity: 1, letterSpacing: '0.3em', duration: 0.04, ease: 'power2.out',
    }, 0.34);
    scrollTl.to('.thread-phase2 .thread-phase-word', {
      opacity: 1, y: 0, duration: 0.04, ease: 'power3.out',
      stagger: 0.015,
    }, 0.35);
    scrollTl.to('.thread-phase2 .thread-phase-divider', {
      width: 64, opacity: 1, duration: 0.04, ease: 'power2.inOut',
    }, 0.37);
    scrollTl.to('.thread-phase2 .thread-phase-desc', {
      opacity: 1, y: 0, duration: 0.04, ease: 'power2.out',
    }, 0.39);
    scrollTl.to('.thread-phase2', {
      opacity: 0, y: -15, duration: 0.04, ease: 'power2.in',
    }, 0.50);

    /* ─── Morph Breast → Body (~54–60%) ─── */
    scrollTl.to(path, {
      morphSVG: { shape: PATH_BODY, shapeIndex: 'auto' },
      duration: 0.08, ease: 'power2.inOut',
    }, 0.54);
    scrollTl.to('.thread-glow-path', {
      morphSVG: { shape: PATH_BODY, shapeIndex: 'auto' },
      duration: 0.08, ease: 'power2.inOut',
    }, 0.54);

    /* ─── Phase 3 (0.58–0.82): THE BODY ─── */

    // Camera: pull back
    scrollTl.to('.thread-perspective', {
      rotateY: 0, scale: 0.96, duration: 0.12, ease: 'power2.inOut',
    }, 0.58);

    // Phase 3 text
    scrollTl.to('.thread-phase3', { opacity: 1, y: 0, duration: 0.02, ease: 'none' }, 0.62);
    scrollTl.to('.thread-phase3 .thread-phase-kicker', {
      opacity: 1, letterSpacing: '0.3em', duration: 0.04, ease: 'power2.out',
    }, 0.62);
    scrollTl.to('.thread-phase3 .thread-phase-word', {
      opacity: 1, y: 0, duration: 0.04, ease: 'power3.out',
      stagger: 0.015,
    }, 0.63);
    scrollTl.to('.thread-phase3 .thread-phase-divider', {
      width: 64, opacity: 1, duration: 0.04, ease: 'power2.inOut',
    }, 0.65);
    scrollTl.to('.thread-phase3 .thread-phase-desc', {
      opacity: 1, y: 0, duration: 0.04, ease: 'power2.out',
    }, 0.67);
    scrollTl.to('.thread-phase3', {
      opacity: 0, y: -15, duration: 0.04, ease: 'power2.in',
    }, 0.78);

    /* ─── Fade out body shape before CTA ─── */
    scrollTl.to(path, {
      opacity: 0, duration: 0.06, ease: 'power2.inOut',
    }, 0.80);
    scrollTl.to('.thread-glow-path', {
      opacity: 0, duration: 0.06, ease: 'power2.inOut',
    }, 0.80);

    /* ─── Phase 4 (0.84–1.00): CTA ─── */

    // Camera reset
    scrollTl.to('.thread-perspective', {
      rotateY: 0, scale: 1, duration: 0.06, ease: 'power2.out',
    }, 0.84);

    // CTA
    scrollTl.to('.thread-cta-wrap', { opacity: 1, y: 0, duration: 0.02, ease: 'none' }, 0.87);
    scrollTl.to('.thread-cta-wrap .thread-phase-kicker', {
      opacity: 1, letterSpacing: '0.3em', duration: 0.04, ease: 'power2.out',
    }, 0.87);
    scrollTl.to('.thread-cta-word', {
      opacity: 1, y: 0, duration: 0.04, ease: 'power3.out',
      stagger: 0.015,
    }, 0.88);
    scrollTl.to('.thread-cta-btn', {
      opacity: 1, scale: 1.0, duration: 0.05, ease: 'power2.out',
    }, 0.91);
    scrollTl.to('.thread-cta-badge', {
      opacity: 1, y: 0, duration: 0.03, ease: 'power2.out',
      stagger: 0.015,
    }, 0.93);

    return () => {
      intro.kill();
      scrollTl.scrollTrigger?.kill();
      scrollTl.kill();
    };
  }, [gsapReady]);

  /* ── Derived ── */
  const titleChars = 'WISTA'.split('');

  return (
    <>
      {/* Cover layout padding gap */}
      <div
        aria-hidden
        className="relative z-40 -mt-16 h-16 lg:-mt-20 lg:h-20"
        style={{ background: '#FFF8E7' }}
      />

      <section
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', background: '#FFF8E7' }}
      >
        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2, opacity: 0.025,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Warm radial atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: 'radial-gradient(ellipse 55% 45% at 45% 50%, rgba(244,226,164,0.10) 0%, transparent 70%)',
          }}
        />

        {/* Perspective wrapper — camera effects */}
        <div
          className="thread-perspective absolute inset-0"
          style={{
            zIndex: 5,
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
          }}
        >
          {/* SVG Line Art Canvas */}
          <svg
            viewBox="0 0 500 720"
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(62vw, 520px)',
              height: 'min(78vh, 640px)',
              filter: 'drop-shadow(0 0 8px rgba(244,226,164,0.45)) drop-shadow(0 0 25px rgba(184,134,11,0.12))',
            }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="threadBronze" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4A847" />
                <stop offset="40%" stopColor="#B8860B" />
                <stop offset="100%" stopColor="#8B6508" />
              </linearGradient>
              <filter id="threadGlow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>
            {/* Glow layer behind main path — starts as breast shape */}
            <path
              className="thread-glow-path"
              d={PATH_FACE}
              fill="none"
              stroke="#D4A847"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#threadGlow)"
              style={{ visibility: gsapOwned ? 'visible' : 'hidden', opacity: 0 }}
            />
            {/* Main morph path — starts as breast shape, hidden until cross-fade */}
            <path
              ref={pathRef}
              d={PATH_FACE}
              fill="none"
              stroke="url(#threadBronze)"
              strokeWidth="3.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ visibility: gsapOwned ? 'visible' : 'hidden', opacity: 0 }}
            />
          </svg>

        </div>

        {/* ═══ INTRO TEXT (fades out on scroll) ═══ */}
        <div
          className="thread-intro-text absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 10, visibility: gsapOwned ? 'visible' : 'hidden' }}
        >
          <p
            className="thread-kicker uppercase mb-7"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(13px, 1.4vw, 17px)', fontWeight: 400,
              color: '#3D3830', letterSpacing: '0.35em',
            }}
          >
            {i18n.kicker}
          </p>

          <div style={{ perspective: '600px' }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(72px, 14vw, 180px)', fontWeight: 300,
              color: '#B8860B', letterSpacing: '0.24em', lineHeight: 0.95,
              textAlign: 'center', display: 'flex', justifyContent: 'center',
            }}>
              {titleChars.map((ch, i) => (
                <span
                  key={i}
                  className="thread-title-char inline-block"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {ch}
                </span>
              ))}
            </h1>
          </div>

          {/* Divider line between title and subtitle */}
          <div
            className="thread-intro-divider mt-3 mb-3 mx-auto"
            style={{
              width: '48px', height: '1px',
              background: 'linear-gradient(to right, transparent, #B8860B, transparent)',
              transformOrigin: 'center',
            }}
          />

          <p
            className="mt-1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 300,
              color: '#8C8070', letterSpacing: '0.3em', textTransform: 'uppercase',
              display: 'flex', justifyContent: 'center',
            }}
          >
            {'Clinic'.split('').map((ch, i) => (
              <span
                key={i}
                className="thread-subtitle-char inline-block"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {ch}
              </span>
            ))}
          </p>

          <a
            href={`/${locale}/booking`}
            className="thread-intro-btn pointer-events-auto mt-10"
            style={{
              display: 'inline-block',
              padding: '18px 54px',
              border: '1px solid #B8860B',
              background: 'transparent',
              color: '#B8860B',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.4s ease, color 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#B8860B';
              e.currentTarget.style.color = '#FFF8E7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#B8860B';
            }}
          >
            {i18n.ctaPrimary}
          </a>
        </div>

        {/* ═══ PHASE 1: The Face ═══ */}
        <div
          className="thread-phase-text thread-phase1 absolute inset-0 flex items-center pointer-events-none"
          style={{ zIndex: 10, visibility: gsapOwned ? 'visible' : 'hidden' }}
        >
          <div className="ml-[7vw] max-w-[440px]">
            <p className="thread-phase-kicker uppercase tracking-[0.3em] mb-3" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(13px, 1.4vw, 17px)', fontWeight: 400, color: '#B8860B',
            }}>{i18n.face.kicker}</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 300,
              color: '#3D3830', lineHeight: 1.1, letterSpacing: '0.03em',
            }}>
              <span className="thread-phase-word inline-block">{i18n.face.title1}</span><br />
              <span className="thread-phase-word inline-block" style={{ color: '#B8860B' }}>{i18n.face.title2}</span>
            </h2>
            <div className="thread-phase-divider my-5 h-[1px]" style={{ background: 'linear-gradient(to right, #B8860B, transparent)' }} />
            <p className="thread-phase-desc" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 300, color: '#5C5549', lineHeight: 1.75,
            }}>
              {i18n.face.desc}
            </p>
          </div>
        </div>

        {/* ═══ PHASE 2: The Breast ═══ */}
        <div
          className="thread-phase-text thread-phase2 absolute inset-0 flex items-center justify-end pointer-events-none"
          style={{ zIndex: 10, visibility: gsapOwned ? 'visible' : 'hidden' }}
        >
          <div className="mr-[7vw] max-w-[440px] text-right">
            <p className="thread-phase-kicker uppercase tracking-[0.3em] mb-3" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(13px, 1.4vw, 17px)', fontWeight: 400, color: '#B8860B',
            }}>{i18n.form.kicker}</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 300,
              color: '#3D3830', lineHeight: 1.1, letterSpacing: '0.03em',
            }}>
              <span className="thread-phase-word inline-block">{i18n.form.title1}</span><br />
              <span className="thread-phase-word inline-block" style={{ color: '#B8860B' }}>{i18n.form.title2}</span>
            </h2>
            <div className="thread-phase-divider my-5 ml-auto h-[1px]" style={{ background: 'linear-gradient(to left, #B8860B, transparent)' }} />
            <p className="thread-phase-desc" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 300, color: '#5C5549', lineHeight: 1.75,
            }}>
              {i18n.form.desc}
            </p>
          </div>
        </div>

        {/* ═══ PHASE 3: The Body ═══ */}
        <div
          className="thread-phase-text thread-phase3 absolute inset-0 flex items-center pointer-events-none"
          style={{ zIndex: 10, visibility: gsapOwned ? 'visible' : 'hidden' }}
        >
          <div className="ml-[7vw] max-w-[440px]">
            <p className="thread-phase-kicker uppercase tracking-[0.3em] mb-3" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(13px, 1.4vw, 17px)', fontWeight: 400, color: '#B8860B',
            }}>{i18n.body.kicker}</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 300,
              color: '#3D3830', lineHeight: 1.1, letterSpacing: '0.03em',
            }}>
              <span className="thread-phase-word inline-block">{i18n.body.title1}</span><br />
              <span className="thread-phase-word inline-block" style={{ color: '#B8860B' }}>{i18n.body.title2}</span>
            </h2>
            <div className="thread-phase-divider my-5 h-[1px]" style={{ background: 'linear-gradient(to right, #B8860B, transparent)' }} />
            <p className="thread-phase-desc" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 300, color: '#5C5549', lineHeight: 1.75,
            }}>
              {i18n.body.desc}
            </p>
          </div>
        </div>

        {/* ═══ PHASE 4: CTA ═══ */}
        <div
          className="thread-cta-wrap absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ zIndex: 10, visibility: gsapOwned ? 'visible' : 'hidden' }}
        >
          <p className="thread-phase-kicker uppercase tracking-[0.35em] mb-5" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(13px, 1.4vw, 17px)', fontWeight: 400, color: '#B8860B',
          }}>{i18n.ctaPhase.kicker}</p>
          <h2 className="mb-8" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 300,
            color: '#3D3830', textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1.15,
          }}>
            {i18n.ctaPhase.title.split(' ').map((word, idx, arr) => (
              <span key={idx} className="thread-cta-word inline-block" style={idx >= Math.ceil(arr.length / 2) ? { color: '#B8860B' } : undefined}>
                {word}{idx < arr.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </h2>
          <a
            ref={ctaRef}
            href={`/${locale}/booking`}
            className="thread-cta-btn group pointer-events-auto"
            style={{
              display: 'inline-block',
              padding: '18px 54px',
              border: '1px solid #B8860B',
              background: 'transparent',
              color: '#B8860B',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '15px', fontWeight: 600,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.4s ease, color 0.4s ease',
              willChange: 'transform',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#B8860B';
              e.currentTarget.style.color = '#FFF8E7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#B8860B';
            }}
          >
            {i18n.ctaPhase.button}
          </a>
          <div className="flex items-center gap-4 mt-10 flex-wrap justify-center">
            {i18n.trustBadges.map((s, i) => (
              <span key={i} className="thread-cta-badge flex items-center gap-4">
                {i > 0 && (
                  <span style={{ color: '#B8860B', fontSize: '8px', opacity: 0.5 }}>&#x2726;</span>
                )}
                <span style={{
                  fontSize: '13px', letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#6B6156', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600,
                }}>{s}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Progress line */}
        <div
          ref={progressBarRef}
          className="absolute bottom-0 left-0 h-[1px]"
          style={{
            zIndex: 20,
            width: '0%',
            background: 'linear-gradient(to right, transparent, #B8860B)',
          }}
        />

        {/* Scroll hint */}
        <div
          className="thread-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          style={{ zIndex: 10, visibility: gsapOwned ? 'visible' : 'hidden' }}
        >
          <p style={{
            fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#B8B0A4', fontFamily: "'Cormorant Garamond', serif",
          }}>{i18n.scrollLabel}</p>
          <div style={{
            width: '1px', height: '24px',
            background: 'linear-gradient(to bottom, #B8860B, transparent)',
            animation: 'threadBounce 2s ease-in-out infinite',
          }} />
        </div>

        {/* Corner accents */}
        {[
          { top: '24px', left: '24px', borderTop: '1px solid', borderLeft: '1px solid' },
          { top: '24px', right: '24px', borderTop: '1px solid', borderRight: '1px solid' },
          { bottom: '24px', left: '24px', borderBottom: '1px solid', borderLeft: '1px solid' },
          { bottom: '24px', right: '24px', borderBottom: '1px solid', borderRight: '1px solid' },
        ].map((pos, i) => (
          <div
            key={i}
            className="thread-corner absolute pointer-events-none"
            style={{
              ...pos,
              width: '36px', height: '36px',
              borderColor: 'rgba(184,134,11,0.18)',
              zIndex: 8,
            } as React.CSSProperties}
          />
        ))}

        <style jsx>{`
          @keyframes threadBounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(6px); opacity: 1; }
          }
        `}</style>
      </section>
    </>
  );
}
