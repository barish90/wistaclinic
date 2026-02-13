'use client'

import React, { useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion'

// Declare confetti on window
declare global {
  interface Window {
    confetti: any
  }
}

interface ThreeDCardProps {
  unwrapProgress?: MotionValue<number>
  onClick?: () => void
}

const ThreeDCard: React.FC<ThreeDCardProps> = ({ unwrapProgress, onClick }) => {
  const ref = useRef<HTMLDivElement>(null)
  const hasFiredConfetti = useRef(false)

  // Mouse interaction state
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth out the mouse movement for a weighted feel
  const mouseX = useSpring(x, { stiffness: 120, damping: 20 })
  const mouseY = useSpring(y, { stiffness: 120, damping: 20 })

  // Map mouse values to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["12deg", "-12deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-12deg", "12deg"])

  // Dynamic sheen effect
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"])

  // --- UNWRAP ANIMATIONS ---
  const defaultProgress = useMotionValue(0)
  const progress = unwrapProgress || defaultProgress

  // Load confetti script manually if it's missing (Fallback)
  useEffect(() => {
    if (typeof window.confetti !== 'function') {
        console.log("Confetti not found, injecting script...")
        const script = document.createElement('script')
        script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"
        script.async = true
        document.body.appendChild(script)
    }
  }, [])

  // Monitor progress for Confetti
  useEffect(() => {
    // Function to handle firing logic
    const checkAndFire = (latest: number) => {
        // Trigger right when the paper splits (0.55)
        if (latest > 0.55 && !hasFiredConfetti.current) {
            hasFiredConfetti.current = true

            // Check if confetti is loaded
            if (typeof window.confetti === 'function') {
                console.log("🚀 POP! Firing Confetti")

                // Maximum Z-Index possible in CSS
                const MAX_Z_INDEX = 2147483647

                const count = 300
                const defaults = {
                    origin: { x: 0.5, y: 0.5 },
                    zIndex: MAX_Z_INDEX,
                    gravity: 1.2,
                    scalar: 1.2,
                    ticks: 500, // Stay on screen longer
                    disableForReducedMotion: false // FORCE animation even if OS prefers reduced motion
                }

                const fire = (particleRatio: number, opts: any) => {
                  window.confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                  }))
                }

                // Burst 1: High Velocity Gold & White
                fire(0.25, { spread: 26, startVelocity: 55, colors: ['#D4AF37', '#ffffff'] })

                // Burst 2: Wide Spread Dark Gold
                fire(0.2, { spread: 60, colors: ['#AA8C2C', '#D4AF37'] })

                // Burst 3: Falling Particles (Decay)
                fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#ffffff', '#D4AF37'] })

                // Burst 4: Fast moving White
                fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#ffffff'] })

                // Burst 5: Red/Green Accents for Visibility (Christmas Theme)
                fire(0.1, { spread: 120, startVelocity: 45, colors: ['#C41E3A', '#228B22', '#D4AF37'] })

            } else {
                console.warn("Confetti library missing during trigger.")
            }
        }
        // Reset if wrapped again
        if (latest < 0.1) {
            hasFiredConfetti.current = false
        }
    }

    // 1. Subscribe to changes
    const unsubscribe = progress.on("change", checkAndFire)

    // 2. IMMEDIATE CHECK: If the page loads and the card is already unwrapped (e.g. dev HMR or fast state), fire immediately.
    checkAndFire(progress.get())

    return unsubscribe
  }, [progress])

  // TIMELINE:
  // 0.0 - 0.2: Knot Unties
  // 0.1 - 0.35: Horizontal Ribbon Slides Right
  // 0.2 - 0.5: Vertical Ribbon Slides Up (EARLIER START)
  // 0.5 - 1.0: Wrapper Splits

  // 1. Wrapper Split & Slide
  const splitStart = 0.5 // Delayed split

  // Y Movement (Opening up/down)
  const topY = useTransform(progress, [splitStart, 1], ["0%", "-120%"])
  const bottomY = useTransform(progress, [splitStart, 1], ["0%", "120%"])

  // Slide Effect (Opening sideways slightly)
  const topX = useTransform(progress, [splitStart, 1], ["0%", "-10%"])
  const bottomX = useTransform(progress, [splitStart, 1], ["0%", "10%"])

  // Rotation for peel effect
  const topRotate = useTransform(progress, [splitStart, 1], ["0deg", "-8deg"])
  const bottomRotate = useTransform(progress, [splitStart, 1], ["0deg", "8deg"])

  const wrapperOpacity = useTransform(progress, [0.85, 1], [1, 0])

  // 2. Ribbon Animation

  // A. Bow (0.0 - 0.20)
  const knotScale = useTransform(progress, [0, 0.2], [1, 0.4])
  const knotOpacity = useTransform(progress, [0.15, 0.25], [1, 0])
  const leftLoopX = useTransform(progress, [0, 0.25], [0, -300])
  const rightLoopX = useTransform(progress, [0, 0.25], [0, 300])
  const loopRotate = useTransform(progress, [0, 0.25], [0, 60])

  // B. Horizontal Ribbon (Slides RIGHT)
  // 0.1 -> 0.35
  const hRibbonX = useTransform(progress, [0.1, 0.35], ["0%", "200%"])
  const hRibbonOpacity = useTransform(progress, [0.3, 0.4], [1, 0])

  // C. Vertical Ribbon (Slides UP)
  // STARTED EARLIER (0.2) to fix lag perception
  // 0.2 -> 0.5
  const vRibbonY = useTransform(progress, [0.2, 0.5], ["0%", "-500%"])
  const vRibbonOpacity = useTransform(progress, [0.45, 0.55], [1, 0])

  // Glare Opacity: Only show glare when fully unwrapped (progress > 0.8)
  const glareOpacity = useTransform(progress, [0.7, 1], [0, 0.8])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top

    const xPct = (mouseXPos / width) - 0.5
    const yPct = (mouseYPos / height) - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  // --- CHRISTMAS PATTERN CONFIG ---
  const holidayPattern = "/images/SVG/holiday.svg"

  // Adjust sizing to fix tearing and green gaps
  // Width > 100% to ensure no side gaps
  // Height > Card Height to push the bottom "tearing" part out of view
  const CARD_HEIGHT = 630
  const HALF_HEIGHT = CARD_HEIGHT / 2
  const BG_WIDTH = '103%' // Stretch horizontally slightly
  const BG_HEIGHT = '680px' // Taller than 630px to allow cropping of bottom

  // --- GLITTER NOISE SVG ---
  const glitterNoise = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E`

  return (
    <motion.div
      style={{
        perspective: 2000,
      }}
      className="relative w-[1000px] h-[630px] z-30 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative"
      >
        {/* ACTUAL GIFT CARD */}
        <div className="absolute inset-0 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-[#FFFEFA] overflow-hidden border-2 border-white/50 flex flex-col items-center justify-center p-16 select-none backface-hidden">

            {/* Glitter / Sparkle Effect Layer - BASE */}
            <div
                className="absolute inset-0 pointer-events-none opacity-60 mix-blend-color-dodge z-0 animate-pulse"
                style={{
                    backgroundImage: `url("${glitterNoise}")`,
                    backgroundSize: '120px 120px'
                }}
            />

            {/* Glitter / Sparkle Effect Layer - OVERLAY (More Intensity) */}
            <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay z-0"
                style={{
                    backgroundImage: `url("${glitterNoise}")`,
                    backgroundSize: '80px 80px',
                    filter: 'contrast(150%) brightness(120%)'
                }}
            />

            {/* Gold Sheen Animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-200/50 to-transparent opacity-50 animate-shimmer pointer-events-none" style={{ backgroundSize: '200% 200%' }} />

            {/* Texture Background - Subtle Snowflakes */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2394a3b8' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M20 22v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-20V0h-2v4h-4v2h4v4h2V6h4V4h-4zM2 22v-4H0v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '40px 40px'
              }}
            />

            {/* Gold Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gold-50/40 to-gold-100/60 pointer-events-none" />

            {/* Decorative Gold Border Lines */}
            <div className="absolute inset-6 border-2 border-gold-200/50 rounded-[2rem] opacity-70" />

            {/* Content Container */}
            <div className="relative z-10 text-center transform translate-z-12" style={{ transform: "translateZ(60px)" }}>
                <div className="bg-gold-500/10 backdrop-blur-sm px-8 py-2 rounded-full inline-block mb-8 border border-gold-200 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    <p className="font-serif text-gold-700 text-lg tracking-[0.4em] font-bold uppercase drop-shadow-sm">New Year Special</p>
                </div>

                <h2 className="font-serif text-[8rem] leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold-400 to-gold-700 mb-2 font-medium drop-shadow-md tracking-tight">Gift</h2>
                <p className="font-sans text-slate-400 text-2xl tracking-[0.8em] uppercase mb-12 font-semibold ml-2">Voucher</p>

                <div className="relative inline-block">
                    <span className="font-serif text-[10rem] leading-none text-gold-600 font-bold tracking-tighter drop-shadow-xl relative z-10">
                        $50
                    </span>
                    {/* Glowing Back Text */}
                    <span className="font-serif text-[10rem] leading-none text-gold-300 font-bold tracking-tighter absolute top-0 left-0 -z-10 blur-[10px] opacity-80 animate-pulse">
                        $50
                    </span>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-gold-200/30 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-gold-200/30 to-transparent rounded-tl-full" />
        </div>

        {/* Realistic Glare on Card (Controlled Opacity) */}
        <motion.div
            style={{
                background: useTransform(
                    [glareX, glareY],
                    ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 40%)`
                ),
                z: 50,
                opacity: glareOpacity
            }}
            className="absolute inset-0 rounded-[3rem] pointer-events-none mix-blend-soft-light"
        />

        {/* Specular Highlight on Edges */}
        <div className="absolute inset-0 rounded-[3rem] ring-2 ring-white/60 pointer-events-none" />

        {/* Physical Thickness */}
        <div
            className="absolute inset-0 rounded-[3rem] bg-[#E0E0E0] transform"
            style={{ transform: "translateZ(-5px) translateY(5px) translateX(5px)" }}
        />


        {/* WRAPPING PAPER LAYERS (CHRISTMAS EDITION - Green) */}

        {/* 1. TOP HALF WRAPPER */}
        <motion.div
            style={{
                y: topY,
                x: topX,
                rotateZ: topRotate,
                opacity: wrapperOpacity,
                transform: "translateZ(2px)",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            }}
            className="absolute top-0 left-0 right-0 h-1/2 z-[60] origin-bottom-left"
        >
             {/* Wrapping Paper */}
             <div className="w-full h-full bg-[#103322] rounded-t-[3rem] relative overflow-hidden border-x border-t border-green-950/50 shadow-sm">

                {/* Christmas Pattern */}
                <div
                    className="absolute inset-0 opacity-100"
                    style={{
                        backgroundImage: `url("${holidayPattern}")`,
                        backgroundSize: `${BG_WIDTH} ${BG_HEIGHT}`,
                        backgroundPosition: 'center top',
                        backgroundRepeat: 'no-repeat'
                    }}
                ></div>

                {/* Vertical Ribbon (Top) - SLIDES UP */}
                <motion.div style={{ y: vRibbonY, opacity: vRibbonOpacity }} className="absolute inset-0">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 bg-gold-500 shadow-xl flex items-center justify-center">
                        <div className="w-[1px] h-full bg-gold-200/50 mx-2"></div>
                        <div className="w-[1px] h-full bg-gold-200/50 mx-2"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/20"></div>
                    </div>
                </motion.div>

                {/* Shadow at cut line */}
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/40 to-transparent"></div>
             </div>
        </motion.div>

        {/* 2. BOTTOM HALF WRAPPER */}
        <motion.div
            style={{
                y: bottomY,
                x: bottomX,
                rotateZ: bottomRotate,
                opacity: wrapperOpacity,
                transform: "translateZ(2px)",
            }}
            className="absolute bottom-0 left-0 right-0 h-1/2 z-[60] origin-top-right"
        >
            {/* CONTAINER for Paper and Ribbon */}
            <div className="relative w-full h-full">

                {/* A. Wrapping Paper (Overflow Hidden for rounded corners) - z-10 */}
                <div className="absolute inset-0 w-full h-full bg-[#103322] rounded-b-[3rem] overflow-hidden border-x border-b border-green-950/50 shadow-sm z-10">

                    {/* Christmas Pattern */}
                    <div
                        className="absolute inset-0 opacity-100"
                        style={{
                            backgroundImage: `url("${holidayPattern}")`,
                            backgroundSize: `${BG_WIDTH} ${BG_HEIGHT}`,
                            backgroundPosition: `center -${HALF_HEIGHT}px`, // Shift background up to continue pattern seamlessly
                            backgroundRepeat: 'no-repeat'
                        }}
                    ></div>

                     {/* Decorative Tag - Holiday Style */}
                    <div className="absolute top-20 right-12 bg-[#FBF7E6] px-8 py-5 rounded-md shadow-[0_10px_20px_rgba(0,0,0,0.3)] transform rotate-6 border-2 border-gold-400 flex flex-col items-center gap-1 z-30">
                         {/* Hole punch */}
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#103322] rounded-full border border-gold-400"></div>

                         {/* String for tag */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-gold-200"></div>

                        <div className="flex flex-col items-center mt-2">
                             <span className="font-serif text-red-800 text-xl font-bold italic whitespace-nowrap">Season's Greetings</span>
                        </div>
                        <div className="w-full h-[1px] bg-gold-300 my-1"></div>
                        <div className="flex flex-col items-center text-center">
                            <span className="text-slate-500 font-sans text-[10px] uppercase tracking-wider font-bold">A Gift From</span>
                            <span className="font-serif text-slate-800 text-lg font-bold">Wista Group</span>
                        </div>
                    </div>

                    {/* Shadow at cut line */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/40 to-transparent"></div>
                </div>

                {/* B. Vertical Ribbon (Bottom) - z-20 (On Top of Paper) */}
                <motion.div style={{ y: vRibbonY, opacity: vRibbonOpacity }} className="absolute inset-0 z-20">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 bg-gold-500 shadow-xl flex items-center justify-center">
                            <div className="w-[1px] h-full bg-gold-200/50 mx-2"></div>
                            <div className="w-[1px] h-full bg-gold-200/50 mx-2"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-black/20"></div>
                    </div>
                </motion.div>

                 {/* C. Horizontal Ribbon (Cross Design) - z-30 (On Top of Vertical) */}
                 <div className="absolute inset-0 rounded-b-[3rem] overflow-hidden z-30 pointer-events-none">
                    <motion.div style={{ x: hRibbonX, opacity: hRibbonOpacity }} className="absolute inset-0">
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gold-500 shadow-xl flex flex-col items-center justify-center transform -translate-y-1/2">
                            <div className="h-[1px] w-full bg-gold-200/50 my-2"></div>
                            <div className="h-[1px] w-full bg-gold-200/50 my-2"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/20"></div>
                        </div>
                    </motion.div>
                 </div>

            </div>
        </motion.div>

        {/* BOW UNTYING ANIMATION - Fades Out First */}
        <motion.div
            style={{
                opacity: knotOpacity,
                scale: knotScale,
                transform: "translateZ(30px)",
                y: topY
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] pointer-events-none"
        >
             <div className="relative flex items-center justify-center">
                {/* Left Loop */}
                <motion.div
                    style={{ x: leftLoopX, rotate: useTransform(loopRotate, r => -r) }}
                    className="absolute right-[10px] w-32 h-32 rounded-tl-[4rem] rounded-bl-[4rem] rounded-tr-lg border-[20px] border-gold-400 bg-gold-500 shadow-2xl origin-right flex items-center justify-center"
                >
                    <div className="w-full h-full rounded-tl-[3rem] rounded-bl-[3rem] border-l-4 border-white/30"></div>
                </motion.div>

                {/* Right Loop */}
                <motion.div
                    style={{ x: rightLoopX, rotate: loopRotate }}
                    className="absolute left-[10px] w-32 h-32 rounded-tr-[4rem] rounded-br-[4rem] rounded-tl-lg border-[20px] border-gold-400 bg-gold-500 shadow-2xl origin-left flex items-center justify-center"
                >
                     <div className="w-full h-full rounded-tr-[3rem] rounded-br-[3rem] border-r-4 border-white/30"></div>
                </motion.div>

                {/* Dangling Tails */}
                <motion.div
                    style={{ x: leftLoopX, rotate: 20 }}
                    className="absolute top-10 right-6 w-20 h-40 bg-gold-500 border-x-4 border-gold-400 -z-10 skew-x-12 origin-top shadow-lg"
                >
                    <div className="absolute bottom-0 w-full h-0 border-l-[40px] border-r-[40px] border-b-[20px] border-l-transparent border-r-transparent border-b-transparent translate-y-full transform rotate-180 scale-x-[1.2]"></div>
                </motion.div>

                <motion.div
                    style={{ x: rightLoopX, rotate: -20 }}
                    className="absolute top-10 left-6 w-20 h-40 bg-gold-500 border-x-4 border-gold-400 -z-10 -skew-x-12 origin-top shadow-lg"
                >
                     <div className="absolute bottom-0 w-full h-0 border-l-[40px] border-r-[40px] border-b-[20px] border-l-transparent border-r-transparent border-b-transparent translate-y-full transform rotate-180 scale-x-[1.2]"></div>
                </motion.div>

                {/* Knot Center */}
                <motion.div
                    className="w-20 h-20 bg-gold-400 rounded-2xl shadow-inner relative z-20 flex items-center justify-center border-4 border-gold-300"
                >
                    <div className="w-12 h-12 rounded-full bg-gold-500/50 blur-[2px]"></div>
                </motion.div>
             </div>
        </motion.div>

      </motion.div>
    </motion.div>
  )
}

export default ThreeDCard
