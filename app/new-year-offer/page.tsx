'use client'

import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import Navbar from '../components/new-year-offer/Navbar'
import Hero from '../components/new-year-offer/Hero'
import IntroSection from '../components/new-year-offer/IntroSection'
import DepartmentSection from '../components/new-year-offer/DepartmentSection'
import Footer from '../components/new-year-offer/Footer'
import { DEPARTMENTS } from '../components/new-year-offer/constants'
import { loadGsap, loadConfetti } from '../utils/loadGsap'

declare global {
  interface Window {
    gsap: any
    ScrollTrigger: any
    ScrollToPlugin: any
  }
}

export default function NewYearOfferPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [gsapLoaded, setGsapLoaded] = useState(false)

  // Load GSAP and Confetti dynamically
  useEffect(() => {
    Promise.all([loadGsap(), loadConfetti()])
      .then(() => setGsapLoaded(true))
      .catch(error => console.error('Failed to load animation libraries:', error))
  }, [])

  // Ensure overflow is set BEFORE rendering scroll-dependent components
  useLayoutEffect(() => {
    // Set page title
    document.title = "New Year Offer - WistaClinic"

    // Store original styles for cleanup
    const originalStyles = {
      htmlOverflow: document.documentElement.style.overflow,
      htmlHeight: document.documentElement.style.height,
      bodyOverflow: document.body.style.overflow,
      bodyHeight: document.body.style.height,
    }

    // Enable scrolling on the document - use !important via inline style
    document.documentElement.style.setProperty('overflow', 'auto', 'important')
    document.documentElement.style.setProperty('overflow-x', 'hidden', 'important')
    document.body.style.setProperty('overflow', 'auto', 'important')
    document.body.style.setProperty('overflow-x', 'hidden', 'important')
    document.documentElement.style.setProperty('height', 'auto', 'important')
    document.body.style.setProperty('height', 'auto', 'important')
    document.documentElement.style.setProperty('min-height', '100%', 'important')
    document.body.style.setProperty('min-height', '100%', 'important')

    // Also set on #root to ensure no parent blocks scroll
    const root = document.getElementById('root')
    if (root) {
      root.style.setProperty('overflow', 'visible', 'important')
      root.style.setProperty('height', 'auto', 'important')
      root.style.setProperty('min-height', '100%', 'important')
    }

    // Signal ready after multiple frames to ensure DOM is fully updated
    // and CSS has been applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsReady(true)
          // Force scroll event to initialize Framer Motion values
          window.dispatchEvent(new Event('scroll'))
        })
      })
    })

    return () => {
      document.documentElement.style.overflow = originalStyles.htmlOverflow
      document.documentElement.style.height = originalStyles.htmlHeight
      document.body.style.overflow = originalStyles.bodyOverflow
      document.body.style.height = originalStyles.bodyHeight
      document.documentElement.style.removeProperty('overflow-x')
      document.body.style.removeProperty('overflow-x')
      document.documentElement.style.removeProperty('min-height')
      document.body.style.removeProperty('min-height')
      if (root) {
        root.style.removeProperty('overflow')
        root.style.removeProperty('height')
        root.style.removeProperty('min-height')
      }
    }
  }, [])

  // Refresh ScrollTrigger when ready
  useEffect(() => {
    if (isReady && gsapLoaded && window.ScrollTrigger) {
      // Delay refresh to ensure all elements are rendered
      const timer = setTimeout(() => {
        window.ScrollTrigger.refresh()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isReady, gsapLoaded])

  // Don't render scroll-dependent components until GSAP is loaded and scroll context is ready
  // This ensures Framer Motion's useScroll hooks and GSAP ScrollTrigger initialize properly
  if (!gsapLoaded || !isReady) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="animate-pulse text-gold-500 font-serif text-2xl">
          {!gsapLoaded ? 'Loading animations...' : 'Loading...'}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="offer-page font-sans antialiased text-slate-900 bg-white" style={{ position: 'relative' }}>

      <Navbar />

      <main className="relative flex flex-col items-center w-full" style={{ position: 'relative' }}>

        {/* 1. HERO */}
        <div className="relative w-full z-10 bg-white">
            <Hero isReady={isReady} />
        </div>

        {/* 2. INTRO */}
        <div className="relative w-full z-20 bg-white shadow-sm">
            <IntroSection />
        </div>

        {/* 3. DEPARTMENTS */}
        {/*
            Mobile: Relative positioning (Natural Scroll) - Prevents "stuck" feeling on phone.
            Desktop (md+): Sticky positioning (Stacking Cards) - Elegant presentation.
        */}
        <div className="w-full relative z-30">
            {DEPARTMENTS.map((dept, index) => (
                <div
                    key={dept.id}
                    className="department-panel relative md:sticky md:top-0 w-full min-h-screen md:h-screen flex items-center justify-center"
                    style={{
                        // Explicit Z-Index ensures stacking order on desktop
                        zIndex: 30 + index
                    }}
                >
                    {/*
                      Card Wrapper:
                      Transparent background to respect the section's color.
                      On Mobile: No padding, full width.
                      On Desktop: Padding to create the card effect.
                    */}
                    <div className="w-full h-full p-0 md:p-6 lg:p-8 bg-transparent">
                        <DepartmentSection data={dept} index={index} />
                    </div>
                </div>
            ))}
        </div>

        {/* Footer - Relative position ensures it scrolls into view after the last pinned panel */}
        <div className="relative w-full z-[100] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.15)]">
            <Footer />
        </div>

      </main>
    </div>
  )
}
