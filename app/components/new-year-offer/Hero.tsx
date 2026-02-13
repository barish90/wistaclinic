'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion'
import ThreeDCard from './ThreeDCard'

interface HeroProps {
  isReady?: boolean
}

const Hero: React.FC<HeroProps> = ({ isReady = true }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollInitialized, setScrollInitialized] = useState(false)

  // Track scroll progress for the whole Hero section
  // Using native Framer Motion useScroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Force re-initialization after mount to ensure scroll context is correct
  useEffect(() => {
    if (isReady) {
      // Give the DOM time to settle with overflow:auto
      const timer = setTimeout(() => {
        setScrollInitialized(true)
        // Force a scroll event to initialize values
        window.dispatchEvent(new Event('scroll'))
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isReady])

  // State for manual click interaction
  const [hasClicked, setHasClicked] = useState(false)
  const hasScrolledAwayRef = useRef(false)

  // Spring to smoothly animate manual unwrap (0 -> 1)
  const manualUnwrap = useSpring(0, { stiffness: 40, damping: 15 })

  // Reset state ONLY when scrolling back to the very top AFTER having scrolled down.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Mark as scrolled away if we pass a threshold (e.g. 10% down)
    if (latest > 0.1) {
      hasScrolledAwayRef.current = true
    }

    // Only reset if we are back at the top AND we have previously scrolled away
    if (latest < 0.02 && hasClicked && hasScrolledAwayRef.current) {
        setHasClicked(false)
        manualUnwrap.set(0)
        hasScrolledAwayRef.current = false
    }
  })

  const handleCardClick = () => {
    if (!hasClicked) {
      setHasClicked(true)
      manualUnwrap.set(1)
    }
  }

  // --- ANIMATION TIMELINE (Total 350vh for extended scroll) ---
  // 1. Unwrapping: 0.05 -> 0.20
  // 2. Hold Card: 0.20 -> 0.45
  // 3. Zoom Through Card: 0.45 -> 0.60
  // 4. Text Reveal: 0.60 -> 0.70
  // 5. Text Static Hold: 0.70 -> 0.95
  // 6. Exit: 0.95 -> 1.00

  // 1. Unwrapping Logic
  const scrollUnwrap = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])
  // Combine scroll-based unwrap and manual click unwrap - whichever is greater
  const unwrapProgress = useTransform([scrollUnwrap, manualUnwrap], ([s, m]) => Math.max(s as number, m as number))

  // 2. Card Scale & Zoom Through
  // Stays at scale 1 until 0.45, then zooms massively to 30x by 0.6
  const cardScale = useTransform(
      scrollYProgress,
      [0, 0.45, 0.6],
      [1, 1, 30]
  )

  // 3. Card Opacity
  // Fade out towards the end of the zoom (0.55 -> 0.60)
  const cardOpacity = useTransform(scrollYProgress, [0.55, 0.6], [1, 0])

  // 4. Reveal Text (Unlock Message)
  // Animation: Zoom IN to Normal (1.5 -> 1.0)
  // Fades in starting at 0.6, Fully visible at 0.7
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])
  // Zoom Out effect: Starts large, settles to 1
  const textScale = useTransform(scrollYProgress, [0.6, 0.75], [1.3, 1]) // Gentler zoom
  const textBlur = useTransform(scrollYProgress, [0.6, 0.7], ["10px", "0px"])

  // 5. Background Elements
  const blobScale = useTransform(scrollYProgress, [0, 1], [0.8, 2.0])

  // 6. EXIT ANIMATION
  // Fade out the entire sticky container at the very end (0.95 -> 0.99)
  const containerOpacity = useTransform(scrollYProgress, [0.95, 0.99], [1, 0])
  // Very subtle push up only at the very end
  const containerY = useTransform(scrollYProgress, [0.95, 1], ["0%", "-5%"])

  // Scroll indicator opacity
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  return (
    <div id="offer" ref={containerRef} className="relative h-[350vh]">

      <motion.div
        style={{ opacity: containerOpacity, y: containerY }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-transparent"
      >

        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
            <motion.div
              style={{ scale: blobScale }}
              className="absolute w-[80vw] h-[80vw] rounded-full bg-gold-100/30 blur-[100px] -translate-y-1/2 translate-x-1/4"
            />
            <motion.div
              style={{ scale: blobScale }}
              className="absolute w-[70vw] h-[70vw] rounded-full bg-rose-100/20 blur-[100px] translate-y-1/4 -translate-x-1/4"
            />
        </div>

        {/* 3D Card - Absolute Center */}
        <div className="absolute z-20 flex items-center justify-center w-full h-full pointer-events-none">
            <motion.div
                style={{
                    scale: cardScale,
                    opacity: cardOpacity,
                }}
                className="flex items-center justify-center perspective-1000 pointer-events-auto"
            >
                {/*
                    Scale Factor:
                    Mobile (<640px): 0.35
                    Tablet (md): 0.7
                    Desktop (lg): 1.0
                */}
                <div className="transform scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-100 origin-center transition-transform duration-300">
                    <ThreeDCard unwrapProgress={unwrapProgress} onClick={handleCardClick} />
                </div>
            </motion.div>
        </div>

        {/* SUCCESS TEXT - Revealed AFTER Zoom */}
        <motion.div
          style={{
            opacity: textOpacity,
            scale: textScale,
            filter: textBlur
          }}
          className="absolute z-10 text-center w-full px-4 flex flex-col items-center justify-center origin-center pointer-events-none"
        >
             <div className="inline-block py-2 px-6 rounded-full bg-white/50 border border-white/60 backdrop-blur-md shadow-sm mb-4 md:mb-8">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-gold-600">
                    Benefits Unlocked
                </span>
             </div>

             <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 leading-[1.1] mb-4 md:mb-8">
                Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 to-gold-700 font-bold block md:inline">$50 worth</span>
                <span className="block mt-1 md:mt-2">of exclusive services</span>
             </h1>

          <p className="text-slate-500 text-sm md:text-xl font-light leading-relaxed max-w-xs md:max-w-2xl mx-auto px-2">
            Your journey to premium care begins now. Scroll down to explore the departments.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
            style={{ opacity: scrollIndicatorOpacity }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
        >
             <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3 text-center">Tap to Unwrap</p>
             <div className="w-6 h-10 border-2 border-slate-300/50 rounded-full flex justify-center p-1 mx-auto">
                <motion.div
                   animate={{ y: [0, 12, 0] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                   className="w-1 h-2 bg-slate-400/50 rounded-full"
                />
             </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero
