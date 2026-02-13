'use client'

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

// Global declaration for GSAP
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    ScrollToPlugin: any;
  }
}

const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('offer');
  const { scrollY } = useScroll();

  // Hide/Show navbar on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Active Section Spy using GSAP ScrollTrigger
  useEffect(() => {
    if (!window.gsap || !window.ScrollTrigger) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    if (window.ScrollToPlugin) {
      gsap.registerPlugin(window.ScrollToPlugin);
    }

    let triggers: any[] = [];

    // Delay trigger creation to ensure all sections are rendered
    const timeoutId = setTimeout(() => {
      const sections = ['offer', 'dental', 'beauty', 'weight', 'lab', 'clinic'];

      sections.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
              // For pinned sections, we detect when they enter the viewport "sweet spot"
              const trigger = ScrollTrigger.create({
                  trigger: element,
                  start: "top center",
                  end: "bottom center",
                  onEnter: () => setActiveSection(id),
                  onEnterBack: () => setActiveSection(id),
              });
              triggers.push(trigger);
          }
      });

      // Refresh ScrollTrigger to recalculate positions
      ScrollTrigger.refresh();
    }, 500);

    return () => {
        clearTimeout(timeoutId);
        triggers.forEach(t => t.kill());
    };
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    // Use GSAP for premium smooth scrolling if available, else fallback
    if (window.gsap) {
      window.gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: `#${id}`, offsetY: 0 },
        ease: "power3.inOut"
      });
    } else {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  return (
    <motion.nav
      variants={{
        visible: { y: 0, backgroundColor: "rgba(255, 255, 255, 0.9)" },
        hidden: { y: "-100%", backgroundColor: "rgba(255, 255, 255, 0.9)" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img
              src="/images/logo/logo-gold-no-title.webp"
              alt="Wista Group"
              className="w-12 h-12 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-800">
              Wista Group
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {['Offer', 'Dental', 'Beauty', 'Weight Loss', 'Lab', 'Clinic'].map((item) => {
              const targetId = item === 'Weight Loss' ? 'weight' : item.toLowerCase();
              const isActive = activeSection === targetId;

              return (
                <a
                  key={item}
                  href={`#${targetId}`}
                  onClick={(e) => handleScrollTo(e, targetId)}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] relative group py-2 transition-colors duration-300 ${isActive ? 'text-gold-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {item}
                  {/* Active Indicator Line */}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-gold-400 transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full opacity-50'}`}></span>
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <div>
            <a
              href="https://wa.me/905070808888?text=Hello,%20I%20would%20like%20to%20claim%20my%20gift!"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-gold-400 text-xs font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-gold-500/20 active:scale-95 uppercase tracking-widest border border-gold-500/20 inline-block"
            >
              Claim Gift
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
