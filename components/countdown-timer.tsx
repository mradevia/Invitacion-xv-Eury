"use client"

import React from "react"

import { useState, useEffect, memo, useCallback, useRef, useMemo } from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { useAnimationFrame } from "@/hooks/use-animation-frame"

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Memoizar cada dígito individual para evitar re-renders innecesarios
const MemoizedDigit = memo(function MemoizedDigit({
  value,
  label,
  enable3D = true
}: {
  value: number
  label: string
  enable3D?: boolean
}) {
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const springConfig = { stiffness: 200, damping: 20 }
  const rotateX = useSpring(useTransform(y, [0, 1], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(x, [0, 1], [-5, 5]), springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !enable3D) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }, [prefersReducedMotion, enable3D, x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0.5)
    y.set(0.5)
  }, [x, y])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !enable3D) return
    const touch = e.touches[0]
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((touch.clientX - rect.left) / rect.width)
    y.set((touch.clientY - rect.top) / rect.height)
  }, [prefersReducedMotion, enable3D, x, y])

  // Cachear el valor formateado
  const displayValue = useMemo(() => String(value).padStart(2, "0"), [value])

  return (
    <motion.div
      className="flex flex-col items-center touch-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX: (prefersReducedMotion || !enable3D) ? 0 : rotateX,
          rotateY: (prefersReducedMotion || !enable3D) ? 0 : rotateY,
          transformStyle: enable3D ? "preserve-3d" : "flat",
        }}
        className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28"
      >
        <div className="absolute inset-0 glass-royal rounded-xl border border-gold-500/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-royal-700/20 to-transparent" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gold-500/20" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-royal-950 rounded-r-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-royal-950 rounded-l-full" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-decorative text-2xl sm:text-3xl md:text-5xl text-gold-100">
            {displayValue}
          </span>
        </div>

        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      <span className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-500/60">
        {label}
      </span>
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // Solo re-renderizar si el valor cambia
  return prevProps.value === nextProps.value && prevProps.enable3D === nextProps.enable3D
})

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const { ref, isIntersecting } = useIntersectionObserver({
    freezeOnceVisible: false,
    rootMargin: "200px",
  })

  // Detectar si es mobile para deshabilitar efectos 3D
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  // Función de cálculo optimizada (cachear constantes)
  const calculateTimeLeft = useCallback(() => {
    const difference = targetDate.getTime() - Date.now()

    if (difference > 0) {
      const days = Math.floor(difference / 86400000) // 1000 * 60 * 60 * 24
      const hours = Math.floor((difference / 3600000) % 24) // 1000 * 60 * 60
      const minutes = Math.floor((difference / 60000) % 60) // 1000 * 60
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
    }
  }, [targetDate])

  // Usar RAF en lugar de setInterval cuando esté visible
  useAnimationFrame(
    calculateTimeLeft,
    1000,
    isIntersecting && mounted
  )

  useEffect(() => {
    setMounted(true)
    calculateTimeLeft() // Cálculo inicial
  }, [calculateTimeLeft])

  // Memoizar las unidades de tiempo
  const timeUnits = useMemo(() => [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ], [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds])

  if (!mounted) {
    return (
      <div className="flex gap-3 sm:gap-4 md:gap-6 justify-center">
        {["Días", "Horas", "Min", "Seg"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 glass-royal rounded-xl border border-gold-500/30 animate-pulse" />
            <span className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold-500/60">
              {label}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex gap-3 sm:gap-4 md:gap-6 justify-center"
      style={{ perspective: isMobile ? "none" : "1000px" }}
    >
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.4,
          }}
        >
          <MemoizedDigit
            value={unit.value}
            label={unit.label}
            enable3D={!isMobile}
          />
        </motion.div>
      ))}
    </div>
  )
}
