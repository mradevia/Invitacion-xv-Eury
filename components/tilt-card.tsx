"use client"

import React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import type { ReactNode } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  glare?: boolean
}

export function TiltCard({ children, className = "", intensity = 15, glare = true }: TiltCardProps) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const springConfig = { stiffness: 300, damping: 30 }
  const rotateX = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), springConfig)
  const rotateY = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), springConfig)

  const glareX = useTransform(x, [0, 1], [0, 100])
  const glareY = useTransform(y, [0, 1], [0, 100])

  const glareGradient = useTransform([glareX, glareY], ([gx, gy]) =>
    `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const xPos = (event.clientX - rect.left) / rect.width
    const yPos = (event.clientY - rect.top) / rect.height
    x.set(xPos)
    y.set(yPos)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.2 } }}
    >
      {children}
      {glare && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden"
          style={{
            background: glareGradient,
          }}
        />
      )}
    </motion.div>
  )
}
