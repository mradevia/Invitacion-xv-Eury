"use client"

import React from "react"

import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { useRef, useEffect, memo, useCallback, useState } from "react"
import { ChevronDown, Heart, Star, Sparkles } from "lucide-react"
import { CountdownTimer } from "../countdown-timer"
import { MagicSparkle } from "../magic-sparkles"

const AnimatedStar = memo(function AnimatedStar({ index }: { index: number }) {
  const left = `${(index * 17 + 5) % 100}%`
  const top = `${(index * 23 + 10) % 100}%`
  const duration = 2 + (index % 3)
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-gold-400 rounded-full"
      style={{ left, top }}
      animate={{ opacity: [0.2, 0.7, 0.2], scale: [0.5, 1, 0.5] }}
      transition={{ duration, repeat: Infinity, delay: index * 0.2 }}
    />
  )
})

const FamilyMember = memo(function FamilyMember({ 
  name, 
  delay 
}: { 
  name: string
  delay: number 
}) {
  return (
    <motion.span 
      className="text-white font-decorative text-lg sm:text-xl block"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {name}
    </motion.span>
  )
})

export function HeroSection() {
  const ref = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const [touchSparkles, setTouchSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  
  // Animaciones separadas para efecto de profundidad
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 4]) // Zoom dramático
  const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]) // Se desvanece rápido
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 300]) // El contenido baja más rápido
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const springConfig = { stiffness: 100, damping: 30 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-5, 5]), springConfig)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion) return
    mouseX.set(e.clientX / window.innerWidth)
    mouseY.set(e.clientY / window.innerHeight)
  }, [prefersReducedMotion, mouseX, mouseY])

  // Touch sparkle effect
  const handleTouch = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const x = "touches" in e ? e.touches[0].clientX : e.clientX
    const y = "touches" in e ? e.touches[0].clientY : e.clientY
    const id = Date.now() + Math.random()
    
    setTouchSparkles(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setTouchSparkles(prev => prev.filter(s => s.id !== id))
    }, 1000)
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    if (prefersReducedMotion) return
    
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      const normalizedBeta = Math.max(-30, Math.min(30, e.beta - 45)) / 60
      const normalizedGamma = Math.max(-30, Math.min(30, e.gamma)) / 60
      mouseY.set(0.5 + normalizedBeta)
      mouseX.set(0.5 + normalizedGamma)
    }

    window.addEventListener("deviceorientation", handleOrientation, { passive: true })
    return () => window.removeEventListener("deviceorientation", handleOrientation)
  }, [prefersReducedMotion, mouseX, mouseY])

  const eventDate = new Date("2026-05-22T19:15:00")

  return (
    <section
      ref={ref}
      className="min-h-screen relative"
      onClick={handleTouch}
      onTouchStart={handleTouch}
    >
      {/* Touch sparkles */}
      {touchSparkles.map(sparkle => (
        <MagicSparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
      ))}
      
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#1a3366_0%,#0d1a33_40%,#020a18_100%)]" />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full opacity-15 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #3366cc 0%, transparent 70%)",
            top: "15%",
            left: "5%",
          }}
          animate={prefersReducedMotion ? {} : { x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full opacity-10 blur-[60px]"
          style={{
            background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            bottom: "10%",
            right: "5%",
          }}
          animate={prefersReducedMotion ? {} : { x: [0, -25, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <AnimatedStar key={i} index={i} />
          ))}
        </div>

        {/* Main Content */}
        <div 
          className="relative z-10 text-center flex flex-col items-center w-full max-w-5xl px-4"
          style={{ perspective: "1000px" }}
        >
          {/* Title section */}
          <motion.div
            style={{ scale: titleScale, opacity: titleOpacity, y: titleY, rotateX, rotateY }}
            className="flex flex-col items-center w-full"
          >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 sm:gap-4 mb-6"
          >
            <motion.div 
              className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-gold-500/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.div
              animate={prefersReducedMotion ? {} : { rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
            </motion.div>
            <motion.div 
              className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-gold-500/50"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-[10px] sm:text-xs text-gold-400/80 tracking-[0.5em] sm:tracking-[0.8em] uppercase mb-4"
          >
            Mis XV Años
          </motion.p>

          <motion.h1
            className="font-decorative text-[15vw] sm:text-[12vw] md:text-[10rem] leading-[0.85] text-transparent bg-clip-text mb-6"
            style={{
              backgroundImage: "linear-gradient(to bottom, #FBF7E6, #D4AF37, #8F7319)",
            }}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            EURYTHMI
          </motion.h1>
          </motion.div>

          {/* Countdown */}
          <motion.div
            style={{ y: contentY, opacity: contentOpacity, rotateX, rotateY }}
            className="w-full flex flex-col items-center"
          >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <p className="font-serif text-[10px] sm:text-xs text-gold-500/60 tracking-widest uppercase mb-3">
              La cuenta regresiva ha comenzado
            </p>
            <CountdownTimer targetDate={eventDate} />
          </motion.div>

          {/* Family Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-4xl w-full relative"
          >
            <motion.div
              style={{ 
                rotateX: prefersReducedMotion ? 0 : rotateX,
                rotateY: prefersReducedMotion ? 0 : rotateY,
              }}
              className="glass-royal px-6 py-8 sm:px-10 sm:py-10 rounded-xl border border-gold-500/20 shadow-2xl"
              whileHover={prefersReducedMotion ? {} : { scale: 1.02, borderColor: "rgba(212, 175, 55, 0.4)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-center md:text-left relative">
                <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gold-500/30 to-transparent" />

                {/* Parents */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-fire-500 mb-2">
                    <motion.div
                      animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Heart className="w-4 h-4 fill-fire-500" />
                    </motion.div>
                    <span className="font-serif text-xs uppercase tracking-widest">
                      Con el amor de mis padres
                    </span>
                  </div>
                  <FamilyMember name="Nancy González Rodríguez" delay={0.8} />
                  <span className="text-gold-500 font-serif text-sm">&</span>
                  <FamilyMember name="Mariano Vaca Angel" delay={0.9} />
                </div>

                {/* Godparents */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gold-500 mb-2">
                    <motion.div
                      animate={prefersReducedMotion ? {} : { rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 fill-gold-500" />
                    </motion.div>
                    <span className="font-serif text-xs uppercase tracking-widest">
                      En compañía de mis padrinos
                    </span>
                  </div>
                  <FamilyMember name="Irma Zárate Angel" delay={1.0} />
                  <span className="text-gold-500 font-serif text-sm">&</span>
                  <FamilyMember name="Manuel Zárate Angel" delay={1.1} />
                </div>
              </div>
            </motion.div>
          </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 sm:bottom-10 text-gold-500/50 flex flex-col items-center gap-2"
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[9px] sm:text-[10px] tracking-widest uppercase">Desliza para ver más</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.div>
      </div>
    </section>
  )
}
