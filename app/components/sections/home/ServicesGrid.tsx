"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { procedures } from "@/lib/data/procedures";
import { useGsap } from "@/app/hooks/useGsap";

interface ServicesGridProps {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}

/* ══════════════════════════════════════════════════════════════
   EDITORIAL INTERACTIVE LIST — V7

   Completely different from all prior versions. This is a
   CREAM-BACKGROUND typographic list — like a fashion magazine
   index / table of contents.

   Each procedure is a wide horizontal row with:
   - Big serif procedure title
   - Kicker label
   - Number counter
   - Gold underline

   On HOVER, a procedure image appears and follows the cursor
   (Awwwards SOTD signature interaction). This creates an
   engaging, discoverable experience without dark backgrounds,
   pinned sections, or horizontal scrolls.

   Scroll animations: ScrollTrigger.batch() staggered reveals
   with curtain-wipe text entrances.

   Design language: Matches ThreadHero cream palette, Cormorant
   Garamond typography, gold accents, but in a COMPLETELY
   different structural layout.
   ══════════════════════════════════════════════════════════════ */

/* ── Editorial kickers per procedure ── */
const kickers: Record<string, string> = {
  rhinoplasty: "The Face",
  "breast-augmentation": "The Form",
  "brazilian-butt-lift": "The Curve",
  liposuction: "The Contour",
  "hair-transplant": "The Crown",
  "facial-aesthetics": "The Expression",
  "body-contouring": "The Silhouette",
};

/* ── SVG accent paths for floating card ── */
const accentPaths: Record<string, string> = {
  rhinoplasty:
    "M 30 20 C 30 35, 28 50, 26 65 C 24 80, 22 88, 20 95 C 18 102, 21 106, 25 108 C 29 110, 32 108, 33 104",
  "breast-augmentation":
    "M 15 50 C 15 65, 18 80, 25 90 C 32 100, 42 105, 50 100 C 58 95, 60 85, 58 75 C 56 65, 50 60, 45 65",
  "brazilian-butt-lift":
    "M 35 20 C 33 35, 28 50, 25 65 C 22 80, 21 90, 23 100 C 25 110, 30 118, 36 122 C 42 126, 46 124, 48 118",
  liposuction:
    "M 30 15 C 28 30, 25 48, 23 62 C 21 76, 22 88, 25 98 C 28 108, 33 115, 40 120",
  "hair-transplant":
    "M 15 70 C 18 58, 25 48, 35 42 C 45 36, 55 35, 62 40 C 69 45, 72 55, 70 65",
  "facial-aesthetics":
    "M 35 18 C 28 25, 22 38, 20 52 C 18 66, 22 80, 28 88 C 34 96, 40 98, 45 95 C 50 92, 53 84, 52 75",
  "body-contouring":
    "M 33 15 C 31 30, 27 48, 25 62 C 23 76, 22 86, 25 96 C 28 106, 34 114, 40 118 C 46 122, 50 120, 52 114",
};

if (process.env.NODE_ENV === "development") {
  const missingSlugs = procedures
    .map((p) => p.slug)
    .filter((slug) => !(slug in kickers) || !(slug in accentPaths));
  if (missingSlugs.length > 0) {
    console.warn(
      `[ServicesGrid] Missing kicker/accentPath mapping for slugs: ${missingSlugs.join(", ")}`,
    );
  }
}

/* ── Floating card dimensions & cursor offsets ── */
const CARD_WIDTH = 220;
const CARD_HEIGHT = 300;
const OFFSET_X = CARD_WIDTH / 2 + 30; // centre-ish, nudged left of cursor
const OFFSET_Y = CARD_HEIGHT / 2 + 40; // centre-ish, nudged above cursor

/* ── Grain texture data URI ── */
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ── Floating card subcomponent ── */
function FloatingProcedureCard({
  proc,
  index,
}: {
  proc: (typeof procedures)[number];
  index: number;
}) {
  const pathD = accentPaths[proc.slug] || "";
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(145deg, rgba(15,14,12,0.95), rgba(30,28,24,0.92))",
        border: "1px solid rgba(184,134,11,0.15)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          mixBlendMode: "overlay",
          backgroundImage: GRAIN_SVG,
        }}
      />
      <span
        className="absolute select-none"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "140px",
          fontWeight: 300,
          color: "rgba(184,134,11,0.06)",
          lineHeight: 1,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <svg
        viewBox="0 0 70 130"
        style={{
          width: "80px",
          height: "auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <path
          d={pathD}
          fill="none"
          stroke="#B8860B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 12px rgba(184,134,11,0.25))" }}
        />
      </svg>
      <span
        className="uppercase mt-4 relative"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "10px",
          fontWeight: 400,
          color: "rgba(184,134,11,0.6)",
          letterSpacing: "0.3em",
          zIndex: 2,
        }}
      >
        {kickers[proc.slug] || ""}
      </span>
    </div>
  );
}

export default function ServicesGrid({ locale, dict }: ServicesGridProps) {
  const { gsapReady } = useGsap();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const floatingImgRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const imgPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const total = procedures.length;

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    checkMobile();
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };
    window.addEventListener("resize", debouncedCheck);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedCheck);
    };
  }, [checkMobile]);

  /* ══════════════════════════════════════════════════════════════
     FLOATING IMAGE — follows cursor with lerp smoothing
     ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (isMobile !== false || !hoveredSlug) return;

    // Seed imgPos from current mouse so there's no jump
    imgPos.current = { ...mousePos.current };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const lerp = 0.12;
      imgPos.current.x += (mousePos.current.x - imgPos.current.x) * lerp;
      imgPos.current.y += (mousePos.current.y - imgPos.current.y) * lerp;

      if (floatingImgRef.current) {
        floatingImgRef.current.style.transform = `translate3d(${imgPos.current.x - OFFSET_X}px, ${imgPos.current.y - OFFSET_Y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, hoveredSlug]);

  /* ══════════════════════════════════════════════════════════════
     DESKTOP — GSAP SCROLL-TRIGGERED LIST REVEALS
     ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!gsapReady || typeof window === "undefined" || isMobile !== false)
      return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      /* ── Header reveal ── */
      if (headerRef.current) {
        const els = headerRef.current.querySelectorAll("[data-reveal]");
        gsap.from(els, {
          opacity: 0,
          y: 50,
          stagger: 0.14,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      /* ── Per-row staggered reveals ── */
      const rows = listRef.current?.querySelectorAll("[data-row]");
      if (!rows) return;

      rows.forEach((row) => {
        const number = row.querySelector("[data-number]");
        const kicker = row.querySelector("[data-kicker]");
        const title = row.querySelector("[data-title]");
        const desc = row.querySelector("[data-desc]");
        const arrow = row.querySelector("[data-arrow]");
        const line = row.querySelector("[data-line]");

        // Set initial states
        if (number) gsap.set(number, { opacity: 0, x: -30 });
        if (kicker) gsap.set(kicker, { opacity: 0, y: 15 });
        if (title) gsap.set(title, { opacity: 0, y: 40 });
        if (desc) gsap.set(desc, { opacity: 0, y: 20 });
        if (arrow) gsap.set(arrow, { opacity: 0, x: -20 });
        if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            once: true,
          },
        });

        // Number slides in from left
        if (number) {
          tl.to(
            number,
            { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
            0,
          );
        }

        // Bottom line wipes in
        if (line) {
          tl.to(line, { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, 0.05);
        }

        // Kicker fades up
        if (kicker) {
          tl.to(
            kicker,
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            0.1,
          );
        }

        // Title slides up (the main event)
        if (title) {
          tl.to(
            title,
            { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
            0.15,
          );
        }

        // Description fades up
        if (desc) {
          tl.to(
            desc,
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            0.25,
          );
        }

        // Arrow slides in
        if (arrow) {
          tl.to(
            arrow,
            { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
            0.3,
          );
        }
      });

      // Refresh so triggers fire immediately for elements already in view
      // (e.g. after browser restores scroll position on refresh)
      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady, isMobile]);

  /* ══════════════════════════════════════════════════════════════
     MOBILE — simpler scroll reveals
     ══════════════════════════════════════════════════════════════ */
  useEffect(() => {
    if (!gsapReady || typeof window === "undefined" || isMobile !== true)
      return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        const els = headerRef.current.querySelectorAll("[data-reveal]");
        gsap.from(els, {
          opacity: 0,
          y: 40,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }

      const mobileCards =
        sectionRef.current?.querySelectorAll("[data-mobile-card]");
      if (!mobileCards) return;
      mobileCards.forEach((card) => {
        const els = card.querySelectorAll("[data-el]");
        const divider = card.querySelector("[data-divider]");

        if (divider) {
          gsap.set(divider, { scaleX: 0, transformOrigin: "left" });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true,
          },
        });

        tl.from(
          card,
          { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" },
          0,
        );

        els.forEach((el: Element, j: number) => {
          tl.from(
            el,
            { opacity: 0, y: 18, duration: 0.6, ease: "power3.out" },
            0.12 + j * 0.07,
          );
        });

        if (divider) {
          tl.to(
            divider,
            { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
            0.25,
          );
        }
      });

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [gsapReady, isMobile]);

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */
  const activeIndex = procedures.findIndex((p) => p.slug === hoveredSlug);
  const activeProcedure = activeIndex !== -1 ? procedures[activeIndex] : null;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ backgroundColor: "#FAF7F2" }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.02, backgroundImage: GRAIN_SVG, zIndex: 0 }}
      />

      {/* ═══ HEADER ═══ */}
      <div
        ref={headerRef}
        className="relative z-10 pt-28 pb-8 lg:pt-36 lg:pb-12 text-center px-6"
      >
        <p
          data-reveal
          className="relative uppercase mb-5"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(11px, 1.2vw, 14px)",
            fontWeight: 400,
            color: "#B8860B",
            letterSpacing: "0.35em",
          }}
        >
          {dict?.home?.services?.subtitle ?? ""}
        </p>
        <h2
          data-reveal
          className="relative"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(40px, 6.5vw, 76px)",
            fontWeight: 300,
            color: "#3D3830",
            letterSpacing: "0.05em",
            lineHeight: 1.1,
          }}
        >
          {dict?.home?.services?.title ?? "Our Services"}
        </h2>
        <div
          data-reveal
          className="relative mx-auto mt-8"
          style={{
            width: "72px",
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #B8860B, transparent)",
          }}
        />
      </div>

      {/* ═══ DESKTOP: Interactive Editorial List ═══ */}
      {isMobile === null ? (
        /* Placeholder while determining viewport — avoids layout shift */
        <div
          className="relative z-10 max-w-6xl mx-auto px-8 lg:px-16 pt-8 pb-20"
          style={{ minHeight: "60vh" }}
        />
      ) : isMobile === false ? (
        <>
          {/* Floating cursor-follow card with SVG accent */}
          <div
            ref={floatingImgRef}
            className="fixed top-0 left-0 pointer-events-none"
            style={{
              width: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              zIndex: 50,
              opacity: hoveredSlug ? 1 : 0,
              transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {activeProcedure && (
              <FloatingProcedureCard
                proc={activeProcedure}
                index={activeIndex}
              />
            )}
          </div>

          {/* The list */}
          <div
            ref={listRef}
            className="relative z-10 max-w-6xl mx-auto px-8 lg:px-16 pt-8 pb-20"
          >
            {procedures.map((procedure, index) => {
              const kicker = kickers[procedure.slug] || "";

              return (
                <Link
                  key={procedure.slug}
                  href={`/${locale}/procedures/${procedure.slug}`}
                  data-row
                  className="group relative block"
                  style={{ textDecoration: "none" }}
                  onMouseEnter={() => setHoveredSlug(procedure.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                >
                  {/* Row content */}
                  <div
                    className="relative py-8 lg:py-10"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "80px 120px 1fr auto",
                      gap: "0 24px",
                      alignItems: "center",
                    }}
                  >
                    {/* Number */}
                    <span
                      data-number
                      className="transition-colors duration-500"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "42px",
                        fontWeight: 300,
                        color:
                          hoveredSlug === procedure.slug
                            ? "#B8860B"
                            : "rgba(61,56,48,0.15)",
                        lineHeight: 1,
                        transition: "color 0.5s ease",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Kicker */}
                    <span
                      data-kicker
                      className="uppercase"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "#B8860B",
                        letterSpacing: "0.25em",
                        opacity: 0.7,
                      }}
                    >
                      {kicker}
                    </span>

                    {/* Title + Description */}
                    <div>
                      <h3
                        data-title
                        className="transition-all duration-500"
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "clamp(32px, 4vw, 56px)",
                          fontWeight: 300,
                          color:
                            hoveredSlug === procedure.slug
                              ? "#3D3830"
                              : "rgba(61,56,48,0.7)",
                          lineHeight: 1.15,
                          letterSpacing: "0.02em",
                          transition: "color 0.5s ease",
                          marginBottom: "6px",
                        }}
                      >
                        {procedure.title}
                      </h3>
                      <p
                        data-desc
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "clamp(14px, 1.2vw, 17px)",
                          fontWeight: 300,
                          color: "rgba(61,56,48,0.4)",
                          lineHeight: 1.6,
                          maxWidth: "480px",
                        }}
                      >
                        {procedure.shortDescription}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div
                      data-arrow
                      className="transition-all duration-500"
                      style={{
                        opacity: hoveredSlug === procedure.slug ? 1 : 0.3,
                        transform:
                          hoveredSlug === procedure.slug
                            ? "translateX(0)"
                            : "translateX(-8px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                      }}
                    >
                      <svg
                        width="48"
                        height="12"
                        viewBox="0 0 48 12"
                        fill="none"
                        className="overflow-visible"
                      >
                        <line
                          x1="0"
                          y1="6"
                          x2="36"
                          y2="6"
                          stroke="#B8860B"
                          strokeWidth="0.75"
                          className="origin-left transition-transform duration-500 group-hover:scale-x-[1.3]"
                        />
                        <path
                          d="M34 2L40 6L34 10"
                          stroke="#B8860B"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform duration-500 group-hover:translate-x-2"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bottom gold line */}
                  <div
                    data-line
                    style={{
                      height: "1px",
                      background:
                        hoveredSlug === procedure.slug
                          ? "linear-gradient(to right, #B8860B, rgba(184,134,11,0.3), transparent)"
                          : "linear-gradient(to right, rgba(184,134,11,0.15), rgba(184,134,11,0.05), transparent)",
                      transition: "background 0.5s ease",
                    }}
                  />
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        /* ═══ MOBILE: Compact card list ═══ */
        <div className="relative z-10 px-6 py-8">
          {procedures.map((procedure, index) => {
            const kicker = kickers[procedure.slug] || "";

            return (
              <Link
                key={procedure.slug}
                href={`/${locale}/procedures/${procedure.slug}`}
                data-mobile-card
                className="group relative block py-7"
                style={{
                  textDecoration: "none",
                  borderBottom:
                    index < total - 1
                      ? "1px solid rgba(184,134,11,0.12)"
                      : "none",
                }}
              >
                {/* Counter + Kicker */}
                <div data-el className="flex items-center gap-3 mb-2">
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "24px",
                      fontWeight: 300,
                      color: "rgba(184,134,11,0.3)",
                      lineHeight: 1,
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "10px",
                      fontWeight: 400,
                      color: "#B8860B",
                      letterSpacing: "0.2em",
                      opacity: 0.6,
                    }}
                  >
                    {kicker}
                  </span>
                </div>

                {/* Title */}
                <h3
                  data-el
                  className="mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(26px, 7vw, 36px)",
                    fontWeight: 300,
                    color: "#3D3830",
                    lineHeight: 1.15,
                    letterSpacing: "0.02em",
                  }}
                >
                  {procedure.title}
                </h3>

                {/* Divider */}
                <div
                  data-el
                  data-divider
                  className="mb-2"
                  style={{
                    width: "32px",
                    height: "1px",
                    background: "#B8860B",
                  }}
                />

                {/* Description */}
                <p
                  data-el
                  className="mb-3"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "rgba(61,56,48,0.5)",
                    lineHeight: 1.7,
                  }}
                >
                  {procedure.shortDescription}
                </p>

                {/* Discover */}
                <span
                  data-el
                  className="uppercase inline-flex items-center gap-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    color: "#B8860B",
                  }}
                >
                  {dict?.common?.discover ?? "Discover"}
                  <svg width="16" height="6" viewBox="0 0 16 6" fill="none">
                    <line
                      x1="0"
                      y1="3"
                      x2="10"
                      y2="3"
                      stroke="#B8860B"
                      strokeWidth="0.75"
                    />
                    <path
                      d="M9 0.5L12.5 3L9 5.5"
                      stroke="#B8860B"
                      strokeWidth="0.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* ═══ VIEW ALL CTA ═══ */}
      <div
        className="relative z-10 py-16 lg:py-24 text-center"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        {/* Top separator */}
        <div
          className="mx-auto mb-12"
          style={{
            width: "1px",
            height: "48px",
            background:
              "linear-gradient(to bottom, transparent, rgba(184,134,11,0.3), transparent)",
          }}
        />
        <Link
          href={`/${locale}/procedures`}
          className="group inline-block"
          style={{ textDecoration: "none" }}
        >
          <span
            className="inline-block transition-all duration-[400ms] hover:!bg-[#B8860B] hover:!text-[#FAF7F2]"
            style={{
              padding: "18px 54px",
              border: "1px solid #B8860B",
              background: "transparent",
              color: "#B8860B",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {dict?.home?.services?.viewAll ?? "View All Procedures"}
          </span>
        </Link>
      </div>
    </section>
  );
}
