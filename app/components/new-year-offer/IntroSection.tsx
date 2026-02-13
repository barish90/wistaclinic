'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { DEPARTMENTS } from './constants'

const IntroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Use native Framer Motion useScroll - works now because overflow is set to auto
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] // Track full height
  })

  // ANIMATION PHASES
  // 0.0 - 0.2: Header Enters
  // 0.2 - 0.5: Header Holds, Cards Enter
  // 0.5 - 0.7: Cards Hold
  // 0.7 - 0.9: Transition OUT (All fade except Dental card, which expands)
  // 0.9 - 1.0: Dental Card is full screen

  // Header Animation
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.6, 0.7], [0, 1, 1, 0])
  const headerScale = useTransform(scrollYProgress, [0, 0.2, 0.7], [0.8, 1, 1])
  const headerY = useTransform(scrollYProgress, [0.6, 0.7], [0, -100])

  // Cards Container Animation (Entry)
  const cardsY = useTransform(scrollYProgress, [0.2, 0.4], [100, 0])
  const cardsOpacity = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])

  // Special Transition for the FIRST Card (Dental)
  // It enters with the group, but exits differently
  // 0.7 -> 0.9: It moves to center and scales up
  const dentalCardScale = useTransform(scrollYProgress, [0.75, 0.95], [1, 15]) // Massive scale to fill screen
  const dentalCardX = useTransform(scrollYProgress, [0.75, 0.95], ["0%", "200%"]) // Adjust to center visually based on grid position (it's first item in 5 col grid)
  const dentalCardY = useTransform(scrollYProgress, [0.75, 0.95], ["0%", "-50%"])

  // Other Cards (They just fade out and drop down)
  const otherCardsOpacity = useTransform(scrollYProgress, [0.7, 0.8], [1, 0])
  const otherCardsY = useTransform(scrollYProgress, [0.7, 0.8], [0, 50])

  // Special white background opacity for first card expansion
  const firstCardBgOpacity = useTransform(scrollYProgress, [0.75, 0.8], [0, 1])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div ref={containerRef} className="relative h-[300vh] z-20">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

       {/* Background Elements */}
       <motion.div style={{ opacity: headerOpacity }} className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-gold-50/50 rounded-full blur-[100px]" />
       </motion.div>

       <div className="max-w-7xl mx-auto px-6 relative w-full flex flex-col h-full justify-center">

          {/* Header Section */}
          <motion.div
             style={{ opacity: headerOpacity, scale: headerScale, y: headerY }}
             className="text-center mb-16 flex-shrink-0"
          >
              <div className="inline-flex items-center gap-2 mb-4 bg-white/80 backdrop-blur-sm py-1 px-4 rounded-full border border-gold-100 shadow-sm relative z-10">
                  <span className="h-[1px] w-8 bg-gold-400"></span>
                  <span className="text-gold-600 font-bold uppercase tracking-[0.2em] text-xs">Full Spectrum Care</span>
                  <span className="h-[1px] w-8 bg-gold-400"></span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-6 leading-tight">
                One Voucher.<br className="md:hidden"/> <span className="text-slate-400 italic">Five Departments.</span>
              </h2>

              <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
                 From aesthetic perfection to essential health, discover the diverse range of premium services available to you.
              </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div
             style={{ y: cardsY, opacity: cardsOpacity }}
             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full"
          >
             {DEPARTMENTS.map((dept, idx) => {
                 const isFirst = idx === 0
                 return (
                 <motion.div
                    key={dept.id}
                    onClick={() => scrollToSection(dept.id)}
                    style={{
                        // Apply special exit transform to first card, regular to others
                        scale: isFirst ? dentalCardScale : 1,
                        x: isFirst ? dentalCardX : 0,
                        y: isFirst ? dentalCardY : otherCardsY,
                        opacity: isFirst ? 1 : otherCardsOpacity, // Force opacity 1 for the first card
                        zIndex: isFirst ? 50 : 1, // Keep first card on top during expansion
                    }}
                    className="group cursor-pointer relative origin-center"
                 >
                    <div className="h-full bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(212,175,55,0.15)] transition-shadow duration-300 flex flex-col items-center text-center relative overflow-hidden aspect-[4/5] justify-center">

                        {/* Hover Gradient Background */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${dept.colorTheme} mix-blend-multiply`} />

                        {/* Special Background for Expansion Transition - Changed to White */}
                        {isFirst && (
                             <motion.div
                                style={{ opacity: firstCardBgOpacity }}
                                className="absolute inset-0 bg-white"
                             />
                        )}

                        {/* Icon/Logo */}
                        {dept.logo ? (
                            <div className="h-12 mb-4 flex items-center justify-center relative z-10">
                                <img src={dept.logo} alt={dept.name} className="h-full w-auto object-contain" />
                            </div>
                        ) : (
                            <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-lg font-bold font-serif shadow-sm relative z-10 ${dept.colorTheme} ${dept.textColor}`}>
                                {dept.name.charAt(0)}
                            </div>
                        )}

                        <h3 className="font-serif font-bold text-slate-900 text-sm md:text-base mb-1 leading-tight relative z-10">{dept.name}</h3>

                        <div className="w-8 h-[2px] bg-slate-100 my-3 group-hover:bg-gold-300 transition-colors duration-300 relative z-10" />

                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover:text-gold-600 transition-colors relative z-10">Explore</p>
                    </div>
                 </motion.div>
             )})}
          </motion.div>
       </div>
      </div>
    </div>
  )
}

export default IntroSection
