"use client"

import { useEffect, useRef, useCallback } from "react"

interface FireParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number
}

interface FireCanvasProps {
  intensity?: number
}

export function FireCanvas({ intensity = 1 }: FireCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FireParticle[]>([])
  const animationRef = useRef<number>()
  const frameCountRef = useRef(0)
  const isMobileRef = useRef(false)

  const createFireParticle = useCallback((x: number, baseY: number) => {
    const particles = particlesRef.current
    const maxParticles = isMobileRef.current ? 50 : 100
    if (particles.length >= maxParticles * intensity) return
    
    const maxLife = Math.random() * 30 + 15
    particles.push({
      x: x + (Math.random() - 0.5) * 30,
      y: baseY,
      vx: (Math.random() - 0.5) * 1,
      vy: -Math.random() * 3 - 1.5,
      life: maxLife,
      maxLife,
      size: Math.random() * 6 + 3,
      hue: Math.random() * 40 + 10,
    })
  }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    isMobileRef.current = window.innerWidth < 768

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      isMobileRef.current = window.innerWidth < 768
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    const emitters = [
      { x: 60 },
      { x: window.innerWidth - 60 },
    ]

    const animate = () => {
      frameCountRef.current++
      
      // Skip frames on mobile
      if (isMobileRef.current && frameCountRef.current % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      
      const frameSkip = isMobileRef.current ? 4 : 2
      if (frameCountRef.current % frameSkip === 0) {
        emitters.forEach(emitter => {
          if (Math.random() > 0.4) {
            createFireParticle(emitter.x, window.innerHeight)
          }
        })
      }

      const particles = particlesRef.current
      ctx.globalCompositeOperation = "lighter"

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        p.x += p.vx
        p.y += p.vy
        p.vy *= 0.98
        p.vy -= 0.03
        p.life -= 1

        if (p.life > 0) {
          const lifeRatio = p.life / p.maxLife
          const alpha = lifeRatio * 0.7
          const size = p.size * lifeRatio

          // Simplified gradient for better performance
          ctx.fillStyle = `hsla(${p.hue + (1 - lifeRatio) * 20}, 100%, ${50 + lifeRatio * 20}%, ${alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx.fill()
        } else {
          particles.splice(i, 1)
        }
      }

      ctx.globalCompositeOperation = "source-over"
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createFireParticle])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: "screen", willChange: "transform" }}
      aria-hidden="true"
    />
  )
}
