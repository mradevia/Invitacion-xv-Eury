"use client"

import { motion, useScroll, useTransform, useInView, useVelocity, useSpring, useMotionValue, useAnimationFrame } from "framer-motion"
import { useRef, type ReactNode } from "react"

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
}

export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  const words = children.split(" ")

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block mr-2">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", rotateX: 90 }}
            animate={isInView ? { y: 0, rotateX: 0 } : { y: "100%", rotateX: 90 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.05,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  )
}

interface CharacterRevealProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
}

export function CharacterReveal({ children, className = "", delay = 0, stagger = 0.03 }: CharacterRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  const words = children.split(" ")
  let charCount = 0

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => {
        const start = charCount
        charCount += word.length + 1
        
        return (
          <span key={i} className={`inline-block whitespace-nowrap ${i === words.length - 1 ? "" : "mr-[0.25em]"}`}>
            {word.split("").map((char, j) => (
              <motion.span
                key={j}
                className="inline-block"
                initial={{ opacity: 0, y: 50, rotateY: 90 }}
                animate={isInView ? { 
                  opacity: 1, 
                  y: 0, 
                  rotateY: 0,
                  textShadow: ["0 0 0px rgba(212, 175, 55, 0)", "0 0 15px rgba(212, 175, 55, 0.8)", "0 0 0px rgba(212, 175, 55, 0)"]
                } : { 
                  opacity: 0, 
                  y: 50, 
                  rotateY: 90,
                  textShadow: "0 0 0px rgba(212, 175, 55, 0)"
                }}
                transition={{
                  duration: 0.6,
                  delay: delay + (start + j) * stagger,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        )
      })}
    </div>
  )
}

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  duration?: number
}

export function FadeIn({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up",
  duration = 0.8
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const directions = {
    up: { y: 60 },
    down: { y: -60 },
    left: { x: 60 },
    right: { x: -60 },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

interface ScaleInProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScaleIn({ children, className = "", delay = 0 }: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
}

interface ScrollProgressBarProps {
  className?: string
}

export function ScrollProgressBar({ className = "" }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-fire-500 origin-left z-[100] ${className}`}
      style={{ scaleX }}
    />
  )
}

// --- NUEVOS EFECTOS TIPO GSAP ---

// 1. Efecto "Jelly" o Skew: El contenido se inclina con la velocidad del scroll
interface SkewOnScrollProps {
  children: ReactNode
  className?: string
}

export function SkewOnScroll({ children, className = "" }: SkewOnScrollProps) {
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const skewVelocity = useSpring(scrollVelocity, {
    stiffness: 100,
    damping: 30
  })
  
  const skewY = useTransform(skewVelocity, [-1000, 1000], [-5, 5])

  return (
    <motion.div 
      style={{ skewY }} 
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  )
}

// 2. Texto Marquee que acelera con el scroll (Efecto muy popular en Awwwards)
interface VelocityTextProps {
  children: string
  baseVelocity?: number
  className?: string
}

export function VelocityText({ children, baseVelocity = 5, className = "" }: VelocityTextProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  })

  // Envuelve el valor entre -20% y -45% para crear el loop infinito
  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef<number>(1)
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    // Cambia la dirección según hacia donde scrolleas
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className={`overflow-hidden whitespace-nowrap flex flex-nowrap ${className}`}>
      <motion.div className="flex flex-nowrap whitespace-nowrap" style={{ x }}>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
        <span className="block mr-8">{children}</span>
      </motion.div>
    </div>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}
