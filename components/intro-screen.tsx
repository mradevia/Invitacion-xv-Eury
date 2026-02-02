"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useState, useEffect, useMemo, memo } from "react"
import { Sparkles } from "lucide-react"

interface IntroScreenProps {
  onComplete: () => void
}

const FloatingParticle = memo(function FloatingParticle({ index }: { index: number }) {
  // Use deterministic values based on index to prevent hydration mismatches
  const x = useMemo(() => (index * 17 + 23) % 100, [index])
  const delay = useMemo(() => (index * 0.5) % 2, [index])
  const duration = useMemo(() => 4 + (index * 0.7) % 2, [index])

  return (
    <motion.div
      className="absolute w-1 h-1 bg-gold-400 rounded-full"
      style={{ left: `${x}%`, boxShadow: "0 0 8px #D4AF37" }}
      initial={{ y: "100vh", opacity: 0, scale: 0 }}
      animate={{ y: "-10vh", opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  )
})

const Ring3D = memo(function Ring3D({ index }: { index: number }) {
  const size = 250 + index * 80
  const duration = 18 + index * 4

  return (
    <motion.div
      className="absolute border border-gold-500/15 rounded-full"
      style={{ width: size, height: size }}
      animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay: index * 0.3 }}
    />
  )
})

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 400)
          return 100
        }
        return p + 2 // Faster loading
      })
    }, 30)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-royal-950 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(15px)",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
        animate={prefersReducedMotion ? {} : {
          background: [
            "radial-gradient(circle at 30% 30%, #1a3366 0%, #020a18 50%, #000 100%)",
            "radial-gradient(circle at 70% 70%, #264d99 0%, #020a18 50%, #000 100%)",
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      />

      {/* Floating particles - reduced count */}
      {!prefersReducedMotion && (
        <AnimatePresence>
          {Array.from({ length: 15 }).map((_, i) => (
            <FloatingParticle key={i} index={i} />
          ))}
        </AnimatePresence>
      )}

      {/* 3D rotating rings - optimized */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "1000px" }}>
          {[0, 1, 2].map((i) => (
            <Ring3D key={i} index={i} />
          ))}
        </div>
      )}

      {/* Giant XV background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <span className="font-decorative text-[40vw] sm:text-[50vw] text-gold-400 select-none">
          XV
        </span>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Decorative sparkles */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="flex justify-center mb-4 sm:mb-6"
        >
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" />
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-serif text-gold-400/80 text-[10px] sm:text-xs md:text-sm tracking-[0.4em] sm:tracking-[0.5em] uppercase mb-3 sm:mb-4"
        >
          Celebración de
        </motion.h2>

        {/* Main title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="font-decorative text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text tracking-wider"
          style={{
            backgroundImage: "linear-gradient(to bottom, #FBF7E6, #D4AF37, #8F7319)",
            textShadow: "0 0 40px rgba(212, 175, 55, 0.4)",
          }}
        >
          EURYTHMI
        </motion.h1>

        {/* XV badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.3, type: "spring" }}
          className="mt-4 sm:mt-6"
        >
          <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 border border-gold-500/30 rounded-full font-serif text-gold-400 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase">
            Mis XV Años
          </span>
        </motion.div>
      </div>

      {/* Loading Progress */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-1 bg-royal-900">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
            style={{ width: `${progress}%`, boxShadow: "0 0 15px #D4AF37" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 font-mono text-[10px] sm:text-xs text-gold-500/50"
        >
          {progress}%
        </motion.div>
      </div>

      {/* Corner decorations - simplified */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner, i) => (
        <motion.div
          key={corner}
          className={`absolute w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 border-gold-500/20 ${corner.includes("top") ? "top-4 sm:top-6 md:top-8" : "bottom-4 sm:bottom-6 md:bottom-8"
            } ${corner.includes("left") ? "left-4 sm:left-6 md:left-8" : "right-4 sm:right-6 md:right-8"} ${corner === "top-left" ? "border-t border-l" :
              corner === "top-right" ? "border-t border-r" :
                corner === "bottom-left" ? "border-b border-l" : "border-b border-r"
            }`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
        />
      ))}
    </motion.div>
  )
}
