"use client"

import { motion, useInView, useScroll, useTransform, useMotionTemplate } from "framer-motion"
import { useRef } from "react"
import { Quote, Sparkles } from "lucide-react"
import { CharacterReveal } from "../scroll-animations"

export function QuoteSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-20%" })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]) // Rotación mucho más pronunciada
  const blurValue = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [12, 0, 0, 12])
  const filter = useMotionTemplate`blur(${blurValue}px)`

  return (
    <section
      ref={ref}
      className="min-h-[70vh] flex items-center justify-center relative py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020a18 0%, #0a1628 50%, #020a18 100%)",
      }}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-geometric.png')",
            backgroundRepeat: "repeat",
          }}
        />
      </motion.div>

      {/* Floating sparkles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        >
          <Sparkles className="w-4 h-4 text-gold-400/30" />
        </motion.div>
      ))}

      {/* Decorative lines */}
      <motion.div
        className="absolute left-0 top-1/2 w-1/4 h-px bg-gradient-to-r from-transparent to-gold-500/20"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ originX: 0 }}
      />
      <motion.div
        className="absolute right-0 top-1/2 w-1/4 h-px bg-gradient-to-l from-transparent to-gold-500/20"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        style={{ originX: 1 }}
      />

      {/* Main content with 3D effect */}
      <motion.div 
        className="max-w-4xl px-8 text-center relative z-10 perspective-container"
        style={{ opacity, scale, rotateX, filter }}
      >
        {/* Quote icon with glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="relative inline-block mb-8"
        >
          <motion.div
            className="absolute inset-0 blur-xl bg-gold-500/20 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <Quote className="w-16 h-16 text-gold-500/50 relative z-10" />
        </motion.div>

        {/* Main quote with character reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <CharacterReveal 
            className="font-decorative text-2xl md:text-4xl lg:text-5xl text-white leading-relaxed justify-center"
            delay={0.5}
            stagger={0.02}
          >
            Hay momentos que nunca olvidamos y que siempre llevamos en el corazón.
          </CharacterReveal>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/50" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-gold-400" />
          </motion.div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/50" />
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="font-serif text-gold-400/80 text-sm md:text-base tracking-[0.2em] uppercase"
        >
          Por eso, me encantaría que compartieras conmigo este día tan especial.
        </motion.p>
      </motion.div>

      {/* Bottom fire glow effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(255, 107, 53, 0.05), transparent)",
        }}
      />
    </section>
  )
}
