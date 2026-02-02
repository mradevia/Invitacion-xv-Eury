"use client"

import React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Lock, Shield, Crown, Sparkles } from "lucide-react"
import { useState } from "react"

interface GatesProps {
  onUnlock: () => void
}

export function Gates({ onUnlock }: GatesProps) {
  const [isHovering, setIsHovering] = useState(false)
  
  // Magnetic button effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { stiffness: 150, damping: 15 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) * 0.3)
    mouseY.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovering(false)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex perspective-container overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.5,
        transition: { duration: 1.5, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Ambient light effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: isHovering 
            ? "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)"
            : "radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)"
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Left Gate */}
      <motion.div
        className="w-1/2 h-full relative flex items-center justify-end origin-left"
        style={{
          background: "linear-gradient(135deg, #0d1a33 0%, #020a18 50%, #000 100%)",
        }}
        initial={{ rotateY: 0, z: -500 }}
        animate={{ rotateY: 0, z: 0 }}
        exit={{ rotateY: -110, x: "-50%", z: -200 }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Gate texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-geometric.png')",
            backgroundRepeat: "repeat",
          }}
        />
        
        {/* Gate pattern - vertical lines */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent"
              style={{ left: `${(i + 1) * 12}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            />
          ))}
        </div>

        {/* Gate emblem */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Shield className="w-40 h-40 text-gold-500" />
        </motion.div>

        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        
        {/* Edge highlight */}
        <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gold-500/40 to-transparent" />
      </motion.div>

      {/* Right Gate */}
      <motion.div
        className="w-1/2 h-full relative flex items-center justify-start origin-right"
        style={{
          background: "linear-gradient(225deg, #0d1a33 0%, #020a18 50%, #000 100%)",
        }}
        initial={{ rotateY: 0, z: -500 }}
        animate={{ rotateY: 0, z: 0 }}
        exit={{ rotateY: 110, x: "50%", z: -200 }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Gate texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-geometric.png')",
            backgroundRepeat: "repeat",
          }}
        />
        
        {/* Gate pattern */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-500/20 to-transparent"
              style={{ right: `${(i + 1) * 12}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            />
          ))}
        </div>

        {/* Gate emblem */}
        <motion.div
          className="absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Crown className="w-40 h-40 text-gold-500" />
        </motion.div>

        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent" />
        
        {/* Edge highlight */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gold-500/40 to-transparent" />
      </motion.div>

      {/* Center Seal - Interactive */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0, rotate: -180 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
      >
        <div 
          className="relative w-72 h-72 flex items-center justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovering(true)}
        >
          {/* Outer animated rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-gold-500/20"
              style={{
                width: `${280 - i * 40}px`,
                height: `${280 - i * 40}px`,
              }}
              animate={{ 
                rotate: i % 2 === 0 ? 360 : -360,
                scale: isHovering ? 1.1 : 1,
              }}
              transition={{ 
                rotate: { duration: 20 + i * 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.3 }
              }}
            />
          ))}

          {/* Sparkle particles when hovering */}
          {isHovering && Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.cos((i / 8) * Math.PI * 2) * 100,
                y: Math.sin((i / 8) * Math.PI * 2) * 100,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
            </motion.div>
          ))}

          {/* Unlock Button */}
          <motion.button
            onClick={onUnlock}
            style={{ x, y }}
            className="relative w-32 h-32 flex items-center justify-center outline-none cursor-pointer group"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Button background with 3D effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-royal-700 via-royal-900 to-black border-2 border-gold-500/50"
              animate={{
                boxShadow: isHovering 
                  ? "0 0 60px rgba(212, 175, 55, 0.5), 0 0 120px rgba(212, 175, 55, 0.3), inset 0 0 30px rgba(212, 175, 55, 0.2)"
                  : "0 0 30px rgba(212, 175, 55, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.5)"
              }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Inner highlight */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gold-500/10 to-transparent" />
            
            {/* Lock icon with animation */}
            <motion.div
              animate={{ 
                rotate: isHovering ? [0, -10, 10, 0] : 0,
                scale: isHovering ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Lock className="relative z-10 w-10 h-10 text-gold-300" />
            </motion.div>
          </motion.button>

          {/* Instruction Text */}
          <motion.p
            className="absolute -bottom-24 font-serif text-sm sm:text-base tracking-[0.2em] text-gold-300 font-bold uppercase w-full text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            animate={{ 
              opacity: [0.6, 1, 0.6],
              y: [0, -5, 0],
              scale: [1, 1.05, 1],
              textShadow: ["0 0 10px rgba(212, 175, 55, 0.3)", "0 0 20px rgba(212, 175, 55, 0.6)", "0 0 10px rgba(212, 175, 55, 0.3)"]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Toca para abrir las puertas
          </motion.p>
        </div>
      </motion.div>

      {/* Fire-like glow at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(255, 107, 53, 0.1), transparent)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  )
}
