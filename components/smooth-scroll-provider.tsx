"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion"

interface ScrollContextValue {
  scrollY: MotionValue<number>
  scrollYProgress: MotionValue<number>
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function useScrollContext() {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error("useScrollContext must be used within SmoothScrollProvider")
  }
  return context
}

interface SmoothScrollProviderProps {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })
  
  const y = useTransform(smoothProgress, (value) => {
    return -(value * (contentHeight - (typeof window !== "undefined" ? window.innerHeight : 0)))
  })

  const scrollY = useSpring(
    useTransform(scrollYProgress, (value) => value * contentHeight),
    { stiffness: 100, damping: 30 }
  )

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContentHeight(containerRef.current.scrollHeight)
      }
    }
    
    updateHeight()
    window.addEventListener("resize", updateHeight)
    
    // Observe content changes
    const observer = new ResizeObserver(updateHeight)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    
    return () => {
      window.removeEventListener("resize", updateHeight)
      observer.disconnect()
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ scrollY, scrollYProgress: smoothProgress }}>
      <div style={{ height: contentHeight }} />
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="fixed top-0 left-0 w-full will-change-transform"
      >
        {children}
      </motion.div>
    </ScrollContext.Provider>
  )
}
