"use client"

import { useEffect, useRef, useCallback, useMemo } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  color: string
}

export function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const isMobileRef = useRef(false)
  const frameCountRef = useRef(0)

  const colors = useMemo(() => ["#D4AF37", "#E2BF4C", "#5b8fd9", "#FBF7E6"], [])

  const createParticle = useCallback((x: number, y: number) => {
    const particles = particlesRef.current
    // Limit particles more strictly
    if (particles.length > (isMobileRef.current ? 30 : 80)) return
    
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.5,
      life: 1,
      size: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }, [colors])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Check if mobile
    isMobileRef.current = window.innerWidth < 768

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
      isMobileRef.current = window.innerWidth < 768
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    let throttleTimeout: ReturnType<typeof setTimeout> | null = null
    
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimeout) return
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null
      }, isMobileRef.current ? 100 : 50)
      
      const dx = e.clientX - lastMouseRef.current.x
      const dy = e.clientY - lastMouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      lastMouseRef.current = { x: e.clientX, y: e.clientY }
      
      if (distance > 10 && Math.random() > 0.5) {
        createParticle(e.clientX, e.clientY)
      }
    }
    
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    const animate = () => {
      frameCountRef.current++
      
      // Skip frames on mobile for better performance
      if (isMobileRef.current && frameCountRef.current % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      
      // Create ambient particles less frequently
      if (frameCountRef.current % (isMobileRef.current ? 120 : 60) === 0) {
        createParticle(
          Math.random() * window.innerWidth,
          window.innerHeight + 10
        )
      }
      
      const particles = particlesRef.current

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.01
        p.life -= 0.02

        if (p.life > 0) {
          ctx.globalAlpha = p.life * 0.6
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
          ctx.fill()
        } else {
          particles.splice(i, 1)
        }
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  )
}
