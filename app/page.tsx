"use client"

import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react"
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Music, Pause } from "lucide-react"
import dynamic from "next/dynamic"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"


import { IntroScreen } from "@/components/intro-screen"
import { Gates } from "@/components/gates"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ScrollProgressBar } from "@/components/scroll-animations"
import { HeroSection } from "@/components/sections/hero-section"
import { QuoteSection } from "@/components/sections/quote-section"
import { EventsSection } from "@/components/sections/events-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { ItinerarySection } from "@/components/sections/itinerary-section"
import { GiftsSection } from "@/components/sections/gifts-section"
import { RSVPSection } from "@/components/sections/rsvp-section"

// Lazy load heavy components with loading states
const GuardianAR = dynamic(
  () => import('@/components/GuardianAR').then((mod) => mod.GuardianAR),
  {
    ssr: false,
    loading: () => <div className="w-full h-96 flex items-center justify-center"><div className="text-gold-400 text-sm">Cargando experiencia AR...</div></div>
  }
)
const ParticlesCanvas = dynamic(
  () => import("@/components/particles-canvas").then(mod => ({ default: mod.ParticlesCanvas })),
  { ssr: false }
)
const FireCanvas = dynamic(
  () => import("@/components/fire-canvas").then(mod => ({ default: mod.FireCanvas })),
  { ssr: false }
)
const FloatingElements = dynamic(
  () => import("@/components/floating-elements").then(mod => ({ default: mod.FloatingElements })),
  { ssr: false }
)
const MagicDust = dynamic(
  () => import("@/components/magic-sparkles").then(mod => ({ default: mod.MagicDust })),
  { ssr: false }
)
const TorchFire = dynamic(
  () => import("@/components/magic-sparkles").then(mod => ({ default: mod.TorchFire })),
  { ssr: false }
)
const MagicCardsReveal = dynamic(
  () => import("@/components/magic-cards-reveal").then(mod => ({ default: mod.MagicCardsReveal })),
  { ssr: false }
)

type Stage = "intro" | "gates" | "scroll" | "cards" | "main"

const heroImages = [
  "/images/heroe1.jpg",
  "/images/img-2.jpg",
]

export default function XVInvitation() {
  const [stage, setStage] = useState<Stage>("intro")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showFireEffect, setShowFireEffect] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleIntroComplete = useCallback(() => setStage("gates"), [])
  const handleGatesUnlock = useCallback(() => setStage("scroll"), [])
  const handleEnterExperience = useCallback(() => setStage("cards"), [])
  const handleCardsComplete = useCallback(() => setStage("main"), [])
  const toggleMusic = useCallback(() => setIsPlaying(prev => !prev), [])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      setShowFireEffect(v < 0.25)
    })
    return unsubscribe
  }, [scrollYProgress])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2
    }

    const attemptPlay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => { })
            }
            document.removeEventListener('click', handleInteraction)
            document.removeEventListener('touchstart', handleInteraction)
          }
          document.addEventListener('click', handleInteraction)
          document.addEventListener('touchstart', handleInteraction)
        }
      }
    }
    attemptPlay()
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => { })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Memoize noise texture style
  const noiseStyle = useMemo(() => ({
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
  }), [])

  return (
    <main
      className="relative min-h-screen"
      style={{
        background: "linear-gradient(180deg, #020a18 0%, #0d1a33 30%, #020a18 100%)",
      }}
    >
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" className="hidden" />

      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.015]"
        style={noiseStyle}
        aria-hidden="true"
      />

      {/* Particles - only on desktop or reduced for mobile */}
      {stage === "main" && !prefersReducedMotion && !isMobile && <ParticlesCanvas />}

      {/* Magic dust particles floating up - reduced on mobile */}
      {stage === "main" && !prefersReducedMotion && <MagicDust count={isMobile ? 8 : 25} />}

      {/* Medieval torch fire on sides - desktop only */}
      {stage === "main" && !isMobile && !prefersReducedMotion && (
        <>
          <TorchFire position="left" />
          <TorchFire position="right" />
        </>
      )}

      {/* Fire effect - optimized */}
      {stage === "main" && showFireEffect && !isMobile && !prefersReducedMotion && (
        <FireCanvas intensity={0.6} />
      )}

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, transparent 60%, rgba(0,0,0,0.3) 100%)",
        }}
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <IntroScreen key="intro" onComplete={handleIntroComplete} />
        )}

        {stage === "gates" && (
          <Gates key="gates" onUnlock={handleGatesUnlock} />
        )}

        {stage === "scroll" && (
          <ScrollReveal key="scroll" onEnter={handleEnterExperience} />
        )}
      </AnimatePresence>

      {/* Magic cards reveal - shows after scroll reveal */}
      <MagicCardsReveal
        images={heroImages}
        isVisible={stage === "cards"}
        onComplete={handleCardsComplete}
      />

      {stage === "main" && (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-0"
        >
          <ScrollProgressBar />

          {!prefersReducedMotion && <FloatingElements />}

          {/* Header */}
          <motion.header
            style={{ opacity: headerOpacity }}
            className="fixed top-0 w-full z-50 px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-royal px-3 py-1.5 sm:px-4 sm:py-2 rounded-full"
            >
              <span className="font-decorative text-lg sm:text-xl font-bold text-gold-400">
                XV
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              onClick={toggleMusic}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-royal flex items-center justify-center group relative overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
            >
              <motion.div
                className="absolute inset-0 bg-gold-500/20"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ borderRadius: "50%" }}
              />

              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 relative z-10" />
              ) : (
                <motion.div
                  className="relative z-10"
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Music className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                </motion.div>
              )}

              {isPlaying && !prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute w-full h-full border border-gold-400/30 rounded-full"
                      animate={{ scale: [1, 1.5 + i * 0.2], opacity: [0.4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.button>
          </motion.header>

          {/* Main content */}
          <div className="w-full">
            <HeroSection />
            <QuoteSection />
            <EventsSection />
            <GallerySection />
            <ItinerarySection />
            <GiftsSection />
            <GuardianAR />
            <RSVPSection />
          </div>

          {/* Footer - Optimized */}
          <footer className="relative py-10 sm:py-12 text-center border-t border-gold-500/10">
            <OptimizedFooter />
          </footer>
        </motion.div>
      )}
    </main>
  )
}

// Memoized footer component para evitar re-renders innecesarios
const OptimizedFooter = memo(function OptimizedFooter() {
  const { ref, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: false,
    rootMargin: "100px",
  })
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <p className="font-decorative text-xl sm:text-2xl text-gold-400 mb-2">
        EURYTHMI
      </p>
      <p className="font-serif text-xs text-gold-500/50 tracking-[0.2em] sm:tracking-[0.3em] uppercase">
        22 de Mayo, 2026
      </p>
      {isIntersecting && (
        <motion.div
          className="mt-4 sm:mt-6 flex justify-center gap-2"
          animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-gold-500/50" />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
})
