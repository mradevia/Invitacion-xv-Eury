"use client"

import React from "react"

import { useCallback, useEffect, memo } from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"
import { Crown, Sparkles } from "lucide-react"
import { AnimatedButton } from "./animated-button"

interface ScrollRevealProps {
  onEnter: () => void
}

const FloatingSparkle = memo(function FloatingSparkle({ index }: { index: number }) {
  const x = (index * 73 + 10) % 100
  const y = (index * 47 + 5) % 100
  const delay = (index * 0.4) % 3
  const duration = 3 + (index % 3)
  
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0], y: [-20, -60] }}
      transition={{ duration, delay, repeat: Infinity }}
    >
      <Sparkles className="w-3 h-3 text-gold-400/50" />
    </motion.div>
  )
})

export function ScrollReveal({ onEnter }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { stiffness: 100, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }, [prefersReducedMotion, mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Mobile gyroscope support
  useEffect(() => {
    if (prefersReducedMotion) return
    
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      mouseY.set((e.beta - 45) * 3)
      mouseX.set(e.gamma * 3)
    }

    window.addEventListener("deviceorientation", handleOrientation, { passive: true })
    return () => window.removeEventListener("deviceorientation", handleOrientation)
  }, [prefersReducedMotion, mouseX, mouseY])

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden p-4"
      style={{
        background: "radial-gradient(ellipse at center, #0d1a33 0%, #020a18 50%, #000 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(15px)" }}
      transition={{ duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Floating sparkles - reduced */}
      {!prefersReducedMotion && Array.from({ length: 12 }).map((_, i) => (
        <FloatingSparkle key={i} index={i} />
      ))}

      {/* 3D Scroll/Parchment */}
      <motion.div
        className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] flex flex-col items-center"
        style={{
          perspective: "1200px",
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ y: 80, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Top Roller */}
        <motion.div 
          className="relative z-20 w-[110%] h-10 sm:h-12 md:h-14 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #5e4610 0%, #2a1d05 40%, #1a1305 100%)",
            boxShadow: "0 6px 25px rgba(0,0,0,0.7)",
            transform: "translateZ(15px)",
          }}
        >
          <div className="absolute top-2 sm:top-3 left-4 right-4 h-px bg-gold-500/20" />
          <div className="absolute left-0 w-4 sm:w-6 h-full bg-gradient-to-r from-[#1a1305] to-transparent" />
          <div className="absolute right-0 w-4 sm:w-6 h-full bg-gradient-to-l from-[#1a1305] to-transparent" />
        </motion.div>

        {/* Paper Content */}
        <motion.div
          className="w-full overflow-hidden relative z-10 origin-top rounded-b-lg"
          style={{
            background: "linear-gradient(180deg, #F5EBC5 0%, #e8d9a8 50%, #dbc892 100%)",
            boxShadow: "0 15px 50px rgba(0,0,0,0.4)",
            transform: "translateZ(8px)",
          }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Decorative border */}
          <div className="absolute inset-3 sm:inset-4 border border-royal-800/10 rounded pointer-events-none" />
          
          <motion.div
            className="p-6 sm:p-8 md:p-10 flex flex-col items-center text-center relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            {/* Crown icon */}
            <motion.div 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4 sm:mb-6 rounded-full border-2 border-royal-800/30 flex items-center justify-center relative"
              animate={prefersReducedMotion ? {} : { 
                boxShadow: ["0 0 15px rgba(26, 51, 102, 0.2)", "0 0 30px rgba(26, 51, 102, 0.3)", "0 0 15px rgba(26, 51, 102, 0.2)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={prefersReducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Crown className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-royal-800" />
              </motion.div>
            </motion.div>
            
            {/* Title */}
            <motion.h3 
              className="font-decorative text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-royal-900 mb-1 sm:mb-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              Real Decreto
            </motion.h3>
            <motion.div 
              className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-royal-800/50 to-transparent mx-auto mb-4 sm:mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            />
            
            {/* Quote */}
            <motion.p 
              className="font-serif text-xs sm:text-sm md:text-base text-royal-900/80 leading-relaxed mb-6 sm:mb-8 italic max-w-[280px] sm:max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9 }}
            >
              {'"Hay momentos que nunca olvidamos. Me encantaría que compartieras conmigo este día tan especial."'}
            </motion.p>
            
            {/* Name */}
            <motion.h2 
              className="font-decorative text-xl sm:text-2xl md:text-3xl text-royal-950 font-bold mb-3 sm:mb-4 tracking-wide"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.1, type: "spring" }}
            >
              EURYTHMI
            </motion.h2>
            
            {/* Date banner */}
            <motion.div 
              className="w-full border-y-2 border-royal-900/10 py-3 sm:py-4 mb-6 sm:mb-8 relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
            >
              {!prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              )}
              <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-royal-800 font-bold relative z-10">
                Viernes • 22 • Mayo • 2026
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              <AnimatedButton onClick={onEnter} variant="primary" size="lg">
                Ver Invitación
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom Roller */}
        <motion.div 
          className="relative z-20 w-[110%] h-10 sm:h-12 md:h-14 rounded-full -mt-4 sm:-mt-5 md:-mt-6 flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(0deg, #5e4610 0%, #2a1d05 40%, #1a1305 100%)",
            boxShadow: "0 -3px 15px rgba(0,0,0,0.4), 0 6px 25px rgba(0,0,0,0.7)",
            transform: "translateZ(15px)",
          }}
        >
          <div className="absolute bottom-2 sm:bottom-3 left-4 right-4 h-px bg-gold-500/20" />
          <div className="absolute left-0 w-4 sm:w-6 h-full bg-gradient-to-r from-[#1a1305] to-transparent" />
          <div className="absolute right-0 w-4 sm:w-6 h-full bg-gradient-to-l from-[#1a1305] to-transparent" />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
