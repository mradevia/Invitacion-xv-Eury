"use client"

import React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { type ReactNode, useRef } from "react"

interface AnimatedButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function AnimatedButton({ 
  children, 
  onClick, 
  className = "",
  variant = "primary",
  size = "md"
}: AnimatedButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { stiffness: 400, damping: 25 }
  const rotateX = useSpring(useTransform(y, [-50, 50], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(x, [-50, 50], [-10, 10]), springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const baseStyles = "relative overflow-hidden font-serif tracking-widest uppercase transition-all duration-300"
  
  const variants = {
    primary: "bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 text-royal-950 border border-gold-300",
    secondary: "bg-royal-800/50 text-gold-400 border border-gold-500/30 backdrop-blur-sm",
    ghost: "bg-transparent text-gold-400 border border-gold-500/20 hover:bg-gold-500/10",
  }

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-8 py-3 text-xs",
    lg: "px-12 py-4 text-sm",
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        scale: 1.05,
        boxShadow: variant === "primary" 
          ? "0 20px 40px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)"
          : "0 10px 30px rgba(0, 0, 0, 0.3), 0 0 40px rgba(212, 175, 55, 0.1)"
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.4) 55%, transparent 60%)",
        }}
        whileHover={{
          opacity: 1,
          x: ["-100%", "100%"],
          transition: { duration: 0.6 }
        }}
      />
      
      {/* Ripple container */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 rounded-inherit"
        style={{
          boxShadow: "inset 0 0 20px rgba(212, 175, 55, 0.5)",
        }}
        whileHover={{ opacity: 1 }}
      />
    </motion.button>
  )
}
