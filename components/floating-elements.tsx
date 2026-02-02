"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Star, Sparkles, Crown } from "lucide-react"
import { useMemo, memo, useEffect, useState } from "react"

interface FloatingElement {
  id: string
  x: number
  y: number
  size: number
  delay: number
  duration: number
  type: "star" | "sparkle" | "crown"
}

const FloatingIcon = memo(function FloatingIcon({ 
  el, 
  className 
}: { 
  el: FloatingElement
  className: string 
}) {
  const Icon = el.type === "star" ? Star : el.type === "crown" ? Crown : Sparkles
  
  return (
    <motion.div
      className="absolute will-change-transform"
      style={{ left: `${el.x}%`, top: `${el.y}%` }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.08, 0.2, 0.08],
      }}
      transition={{
        duration: el.duration,
        delay: el.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon size={el.size} className={className} fill={el.type === "star" ? "currentColor" : "none"} />
    </motion.div>
  )
})

export function FloatingElements() {
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, -100])

  // Reduced element counts for better performance
  const elements = useMemo(() => {
    const count1 = isMobile ? 5 : 8
    const count2 = isMobile ? 6 : 10
    
    return {
      layer1: Array.from({ length: count1 }, (_, i) => ({
        id: `l1-${i}`,
        x: (i * 13 + 5) % 100,
        y: (i * 17 + 8) % 100,
        size: 6 + (i % 3) * 3,
        delay: (i * 0.8) % 5,
        duration: 18 + (i % 4) * 3,
        type: "star" as const,
      })),
      layer2: Array.from({ length: count2 }, (_, i) => ({
        id: `l2-${i}`,
        x: (i * 11 + 3) % 100,
        y: (i * 19 + 12) % 100,
        size: 4 + (i % 3) * 2,
        delay: (i * 0.6) % 4,
        duration: 15 + (i % 3) * 3,
        type: i % 4 === 0 ? "crown" as const : "sparkle" as const,
      })),
    }
  }, [isMobile])

  if (prefersReducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Layer 1 */}
      <motion.div className="absolute inset-0" style={{ y: layer1Y }}>
        {elements.layer1.map((el) => (
          <FloatingIcon key={el.id} el={el} className="text-gold-500/10" />
        ))}
      </motion.div>

      {/* Layer 2 */}
      <motion.div className="absolute inset-0" style={{ y: layer2Y }}>
        {elements.layer2.map((el) => (
          <FloatingIcon key={el.id} el={el} className="text-royal-400/15" />
        ))}
      </motion.div>

      {/* Fire embers - reduced for mobile */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={`ember-${i}`}
              className="absolute bottom-0 will-change-transform"
              style={{ left: `${(i * 11 + 5) % 100}%` }}
              animate={{
                y: [0, -150 - (i % 3) * 50],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + (i % 2),
                delay: (i * 0.5) % 4,
                repeat: Infinity,
                ease: "easeOut",
              }}
            >
              <div 
                className="w-1 h-1 rounded-full"
                style={{
                  background: `hsl(${25 + (i % 3) * 10}, 100%, 50%)`,
                  boxShadow: `0 0 6px hsl(${25 + (i % 3) * 10}, 100%, 50%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
