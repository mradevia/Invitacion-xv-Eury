"use client"

import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { memo, useState, useEffect, useCallback } from "react"
import Image from "next/image"

interface MagicParticle {
  id: number
  x: number
  y: number
  size: number
  color: string
  angle: number
  speed: number
}

// Explosion particle burst
const ExplosionParticles = memo(function ExplosionParticles({ 
  isActive,
  centerX,
  centerY
}: { 
  isActive: boolean
  centerX: number
  centerY: number 
}) {
  const [particles, setParticles] = useState<MagicParticle[]>([])
  
  useEffect(() => {
    if (!isActive) return
    
    const newParticles: MagicParticle[] = []
    const colors = ["#D4AF37", "#FBF7E6", "#3366cc", "#ff6b35", "#ffd700"]
    
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        size: 3 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (i / 60) * 360 + Math.random() * 30,
        speed: 150 + Math.random() * 200,
      })
    }
    setParticles(newParticles)
    
    const timer = setTimeout(() => setParticles([]), 1500)
    return () => clearTimeout(timer)
  }, [isActive, centerX, centerY])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            left: p.x,
            top: p.y,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.speed,
            y: Math.sin((p.angle * Math.PI) / 180) * p.speed,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      ))}
    </div>
  )
})

// Magic ring that expands outward
const MagicRing = memo(function MagicRing({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="absolute inset-0 border-2 border-gold-400 rounded-lg"
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 1.5, delay, ease: "easeOut" }}
    />
  )
})

// Individual magic card
const MagicCard = memo(function MagicCard({
  imageSrc,
  index,
  isFlipping,
  onFlipComplete,
  totalCards,
}: {
  imageSrc: string
  index: number
  isFlipping: boolean
  onFlipComplete: () => void
  totalCards: number
}) {
  const prefersReducedMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const isFirst = index === 0
  
  // Calculate initial positions - cards come from different angles
  const initialRotation = isFirst ? -15 : 15
  const initialX = isFirst ? -200 : 200
  
  return (
    <motion.div
      className="absolute w-[280px] h-[380px] sm:w-[320px] sm:h-[440px] md:w-[380px] md:h-[520px]"
      style={{
        transformStyle: "preserve-3d",
        zIndex: totalCards - index,
      }}
      initial={{ 
        x: initialX,
        y: 100,
        rotateY: initialRotation,
        rotateZ: initialRotation / 2,
        scale: 0,
        opacity: 0,
      }}
      animate={isFlipping ? {
        x: isFirst ? (isMobile ? -85 : -210) : (isMobile ? 85 : 210),
        y: 0,
        rotateY: [initialRotation, initialRotation + 180, initialRotation + 360],
        rotateZ: 0,
        scale: isMobile ? [0, 0.7, 0.6] : [0, 1.1, 1],
        opacity: 1,
      } : {}}
      transition={{ 
        duration: prefersReducedMotion ? 0.5 : 2,
        delay: index * 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onAnimationComplete={index === totalCards - 1 ? onFlipComplete : undefined}
    >
      {/* Card glow effect */}
      <motion.div
        className="absolute -inset-4 rounded-2xl blur-xl"
        style={{
          background: "radial-gradient(ellipse, rgba(212, 175, 55, 0.4) 0%, transparent 70%)",
        }}
        animate={isFlipping ? {
          opacity: [0, 0.8, 0.4],
          scale: [0.8, 1.2, 1],
        } : { opacity: 0 }}
        transition={{ duration: 2, delay: index * 0.3 }}
      />
      
      {/* Card front */}
      <div 
        className="absolute inset-0 rounded-xl overflow-hidden border-2 border-gold-500/50 shadow-2xl"
        style={{
          backfaceVisibility: "hidden",
          background: "linear-gradient(145deg, #1a3366 0%, #0d1a33 100%)",
        }}
      >
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={`Eurythmi - Imagen ${index + 1}`}
          fill
          className="object-cover"
          priority
        />
        
        {/* Gold frame overlay */}
        <div className="absolute inset-0 border-[6px] border-gold-500/30 rounded-xl pointer-events-none" />
        
        {/* Corner decorations */}
        {[0, 1, 2, 3].map((corner) => (
          <motion.div
            key={corner}
            className="absolute w-8 h-8"
            style={{
              top: corner < 2 ? 8 : "auto",
              bottom: corner >= 2 ? 8 : "auto",
              left: corner % 2 === 0 ? 8 : "auto",
              right: corner % 2 === 1 ? 8 : "auto",
            }}
          >
            <svg viewBox="0 0 32 32" className="w-full h-full text-gold-400">
              <motion.path
                d={corner === 0 ? "M2 12 L2 2 L12 2" : 
                   corner === 1 ? "M20 2 L30 2 L30 12" :
                   corner === 2 ? "M2 20 L2 30 L12 30" : "M20 30 L30 30 L30 20"}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={isFlipping ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.3 + 1 }}
              />
            </svg>
          </motion.div>
        ))}
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
          }}
          initial={{ x: "-100%" }}
          animate={isFlipping ? { x: "200%" } : {}}
          transition={{ duration: 1.5, delay: index * 0.3 + 0.5 }}
        />
      </div>
      
      {/* Magic rings on flip */}
      {isFlipping && (
        <>
          <MagicRing delay={index * 0.3 + 0.5} />
          <MagicRing delay={index * 0.3 + 0.8} />
        </>
      )}
    </motion.div>
  )
})

// Main component
export function MagicCardsReveal({
  images,
  isVisible,
  onComplete,
}: {
  images: string[]
  isVisible: boolean
  onComplete: () => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<"waiting" | "flipping" | "exploding" | "fading" | "done">("waiting")
  const [showExplosion, setShowExplosion] = useState(false)
  
  useEffect(() => {
    if (!isVisible) {
      setPhase("waiting")
      return
    }
    
    // Start flipping after a small delay
    const flipTimer = setTimeout(() => setPhase("flipping"), 500)
    
    return () => clearTimeout(flipTimer)
  }, [isVisible])
  
  const handleFlipComplete = useCallback(() => {
    // After flip, trigger explosion
    setPhase("exploding")
    setShowExplosion(true)
    
    // Then fade cards
    setTimeout(() => {
      setPhase("fading")
      setShowExplosion(false)
    }, 1200)
    
    // Finally complete
    setTimeout(() => {
      setPhase("done")
      onComplete()
    }, prefersReducedMotion ? 1500 : 3000)
  }, [onComplete, prefersReducedMotion])
  
  if (!isVisible || phase === "done") return null
  
  return (
    <motion.div 
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Magic circle background */}
      <motion.div
        className="absolute w-[600px] h-[600px] sm:w-[800px] sm:h-[800px]"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={phase !== "waiting" ? {
          scale: 1,
          opacity: phase === "fading" ? 0 : 0.3,
          rotate: 360,
        } : {}}
        transition={{ duration: 3, ease: "linear" }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Outer circle */}
          <motion.circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={phase !== "waiting" ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5 }}
          />
          {/* Inner circle */}
          <motion.circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1"
            strokeDasharray="10 5"
            initial={{ pathLength: 0 }}
            animate={phase !== "waiting" ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          {/* Star pattern */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.line
              key={i}
              x1="200"
              y1="200"
              x2={200 + Math.cos((angle * Math.PI) / 180) * 190}
              y2={200 + Math.sin((angle * Math.PI) / 180) * 190}
              stroke="#D4AF37"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={phase !== "waiting" ? { pathLength: 1, opacity: 0.5 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
        </svg>
      </motion.div>
      
      {/* Floating runes */}
      <div className="absolute inset-0 pointer-events-none">
        {!prefersReducedMotion && ["XV", "2026", "EURYTHMI"].map((text, i) => (
          <motion.span
            key={i}
            className="absolute font-decorative text-gold-400/30 text-2xl sm:text-4xl"
            style={{
              left: `${20 + i * 30}%`,
              top: `${15 + (i % 2) * 70}%`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={phase !== "waiting" && phase !== "fading" ? {
              opacity: [0, 0.5, 0],
              y: [20, 0, -20],
            } : { opacity: 0 }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          >
            {text}
          </motion.span>
        ))}
      </div>
      
      {/* Cards container */}
      <div className="relative flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        {images.map((img, i) => (
          <MagicCard
            key={i}
            imageSrc={img}
            index={i}
            isFlipping={phase === "flipping" || phase === "exploding" || phase === "fading"}
            onFlipComplete={handleFlipComplete}
            totalCards={images.length}
          />
        ))}
      </div>
      
      {/* Explosion particles */}
      <ExplosionParticles 
        isActive={showExplosion}
        centerX={typeof window !== "undefined" ? window.innerWidth / 2 : 500}
        centerY={typeof window !== "undefined" ? window.innerHeight / 2 : 400}
      />
      
      {/* Title reveal during animation */}
      <AnimatePresence>
        {(phase === "flipping" || phase === "exploding") && (
          <motion.div
            className="absolute bottom-20 sm:bottom-32 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.p 
              className="font-sans text-[10px] sm:text-xs text-gold-400/80 tracking-[0.5em] uppercase mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Mis XV Años
            </motion.p>
            <motion.h2 
              className="font-decorative text-4xl sm:text-6xl text-gold-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              EURYTHMI
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fading cards indicator */}
      <AnimatePresence>
        {phase === "fading" && (
          <motion.div
            className="absolute bottom-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p 
              className="text-gold-400/60 text-sm font-serif"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Preparando tu experiencia mágica...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
