"use client"

import { motion, useReducedMotion } from "framer-motion"
import { memo, useEffect, useState } from "react"

// Magic sparkle that appears on touch/click - bigger and more dramatic
export const MagicSparkle = memo(function MagicSparkle({ 
  x, 
  y 
}: { 
  x: number
  y: number 
}) {
  return (
    <motion.div
      className="fixed pointer-events-none z-[200]"
      style={{ left: x - 40, top: y - 40 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.5, 0], 
        opacity: [0, 1, 0],
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Central star burst with more rays */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <motion.line
            key={i}
            x1="40"
            y1="40"
            x2={40 + Math.cos((angle * Math.PI) / 180) * 35}
            y2={40 + Math.sin((angle * Math.PI) / 180) * 35}
            stroke={i % 2 === 0 ? "#D4AF37" : "#FBF7E6"}
            strokeWidth={i % 3 === 0 ? 3 : 2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, delay: i * 0.02 }}
          />
        ))}
        {/* Center glow */}
        <motion.circle
          cx="40"
          cy="40"
          r="8"
          fill="#FBF7E6"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 0.5 }}
        />
        {/* Outer ring */}
        <motion.circle
          cx="40"
          cy="40"
          r="30"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2], opacity: [1, 0] }}
          transition={{ duration: 0.7 }}
        />
      </svg>
    </motion.div>
  )
})

// Secondary smaller particles that trail from main sparkle
export const TrailParticle = memo(function TrailParticle({
  x,
  y,
  delay = 0
}: {
  x: number
  y: number
  delay?: number
}) {
  const angle = Math.random() * 360
  const distance = 30 + Math.random() * 50
  
  return (
    <motion.div
      className="fixed pointer-events-none z-[199] w-2 h-2 rounded-full"
      style={{
        left: x,
        top: y,
        backgroundColor: Math.random() > 0.5 ? "#D4AF37" : "#3366cc",
        boxShadow: "0 0 8px currentColor",
      }}
      initial={{ scale: 0, opacity: 1 }}
      animate={{
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance,
        scale: [0, 1, 0],
        opacity: [1, 0.8, 0],
      }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    />
  )
})

// Floating dust particles - optimized for performance
export const MagicDust = memo(function MagicDust({ count = 30 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion()
  const [particles, setParticles] = useState<Array<{
    id: number
    size: number
    left: number
    duration: number
    delay: number
    color: string
  }>>([])
  
  useEffect(() => {
    if (prefersReducedMotion) return
    
    const colors = ["#D4AF37", "#3366cc", "#FBF7E6"]
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: 2 + Math.random() * 4,
      left: Math.random() * 100,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 8,
      color: colors[i % colors.length],
    }))
    setParticles(newParticles)
  }, [count, prefersReducedMotion])
  
  if (prefersReducedMotion || particles.length === 0) return null
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: -20,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
            opacity: [0, 0.7, 0.7, 0],
            scale: [0.5, 1, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
})

// Medieval torch fire effect - optimized
export const TorchFire = memo(function TorchFire({ 
  position 
}: { 
  position: "left" | "right" 
}) {
  return null
})

// 3D floating orb for mobile gyroscope
export const MagicOrb = memo(function MagicOrb({
  size = 100,
  color = "#D4AF37",
  position,
}: {
  size?: number
  color?: string
  position: { x: string; y: string }
}) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
      animate={prefersReducedMotion ? {} : {
        y: [0, -20, 0],
        rotateY: [0, 360],
      }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}80, ${color}40 50%, transparent 70%)`,
          boxShadow: `0 0 ${size / 2}px ${color}40, inset 0 0 ${size / 4}px ${color}60`,
        }}
      />
    </motion.div>
  )
})
