'use client'

import { useRef, useLayoutEffect, useState, useEffect } from 'react'
import Navbar from '@/app/components/new-year-offer/Navbar'
import Hero from '@/app/components/new-year-offer/Hero'
import IntroSection from '@/app/components/new-year-offer/IntroSection'
import DepartmentSection from '@/app/components/new-year-offer/DepartmentSection'
import Footer from '@/app/components/new-year-offer/Footer'
import { DEPARTMENTS } from '@/app/components/new-year-offer/constants'
import { loadGsap, loadConfetti } from '@/app/utils/loadGsap'
import { reportError } from '@/lib/errors'

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
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    Promise.all([loadGsap(), loadConfetti()])
      .then(() => setGsapLoaded(true))
      .catch(error => {
        reportError(error, 'NewYearOffer');
        setLoadError(true);
      })
  }, [])

  useLayoutEffect(() => {
    // Title is set via document.title because this legacy page uses 'use client'
    // and cannot export generateMetadata. The (legacy) route group has no head management.
    document.title = "New Year Offer - WistaClinic"

    const originalStyles = {
      htmlOverflow: document.documentElement.style.overflow,
      htmlHeight: document.documentElement.style.height,
      bodyOverflow: document.body.style.overflow,
      bodyHeight: document.body.style.height,
    }

    document.documentElement.style.setProperty('overflow', 'auto', 'important')
    document.documentElement.style.setProperty('overflow-x', 'hidden', 'important')
    document.body.style.setProperty('overflow', 'auto', 'important')
    document.body.style.setProperty('overflow-x', 'hidden', 'important')
    document.documentElement.style.setProperty('height', 'auto', 'important')
    document.body.style.setProperty('height', 'auto', 'important')
    document.documentElement.style.setProperty('min-height', '100%', 'important')
    document.body.style.setProperty('min-height', '100%', 'important')

    const root = document.getElementById('root')
    if (root) {
      root.style.setProperty('overflow', 'visible', 'important')
      root.style.setProperty('height', 'auto', 'important')
      root.style.setProperty('min-height', '100%', 'important')
    }

    // Schedule ready state after paint: single rAF + setTimeout(0) for reliable timing
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsReady(true)
        window.dispatchEvent(new Event('scroll'))
      }, 0)
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

  useEffect(() => {
    if (isReady && gsapLoaded && window.ScrollTrigger) {
      const timer = setTimeout(() => {
        window.ScrollTrigger.refresh()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isReady, gsapLoaded])

  if (loadError) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center" role="alert">
        <div className="text-center px-6">
          <p className="text-gray-700 font-serif text-xl mb-4">Unable to load animations</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!gsapLoaded || !isReady) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center" role="status" aria-live="polite" aria-busy="true">
        <div className="animate-pulse text-gold-500 font-serif text-2xl">
          <span className="sr-only">Loading page content</span>
          {!gsapLoaded ? 'Loading animations...' : 'Loading...'}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="offer-page font-sans antialiased text-slate-900 bg-white" style={{ position: 'relative' }}>

      <Navbar />

      <main className="relative flex flex-col items-center w-full" style={{ position: 'relative' }}>

        <div className="relative w-full z-10 bg-white">
            <Hero isReady={isReady} />
        </div>

        <div className="relative w-full z-20 bg-white shadow-sm">
            <IntroSection />
        </div>

        <div className="w-full relative z-30">
            {DEPARTMENTS.map((dept, index) => (
                <div
                    key={dept.id}
                    className="department-panel relative md:sticky md:top-0 w-full min-h-screen md:h-screen flex items-center justify-center"
                    style={{
                        zIndex: 30 + index,
                        willChange: 'transform',
                    }}
                >
                    <div className="w-full h-full p-0 md:p-6 lg:p-8 bg-transparent">
                        <DepartmentSection data={dept} index={index} />
                    </div>
                </div>
            ))}
        </div>

        <div className="relative w-full z-[100] bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.15)]">
            <Footer />
        </div>

      </main>
    </div>
  )
}
