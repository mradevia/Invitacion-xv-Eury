"use client"

import React from "react"

import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Car, Clock, ExternalLink, X } from "lucide-react"
import { AnimatedButton } from "./animated-button"

interface LocationMap3DProps {
  venue: string
  address: string
  coordinates: { lat: number; lng: number }
  mapUrl: string
}

export function LocationMap3D({ venue, address, coordinates, mapUrl }: LocationMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  
  const springConfig = { stiffness: 150, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [15, -15]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), springConfig)
  const z = useSpring(useTransform(mouseY, [0, 0.5, 1], [20, 0, 20]), springConfig)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [isMobile, mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  // Gyroscope for mobile 3D effect
  useEffect(() => {
    if (!isMobile) return
    
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return
      // Normalize values (-90 to 90 for beta, -180 to 180 for gamma)
      const normalizedBeta = Math.max(-45, Math.min(45, e.beta - 45)) / 45
      const normalizedGamma = Math.max(-45, Math.min(45, e.gamma)) / 45
      mouseY.set(0.5 + normalizedBeta * 0.5)
      mouseX.set(0.5 + normalizedGamma * 0.5)
    }

    window.addEventListener("deviceorientation", handleOrientation)
    return () => window.removeEventListener("deviceorientation", handleOrientation)
  }, [isMobile, mouseX, mouseY])

  return (
    <>
      <motion.div
        ref={containerRef}
        className="relative w-full max-w-md mx-auto cursor-pointer"
        style={{ perspective: "1200px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          style={{ 
            rotateX: isMobile ? rotateX : rotateX, 
            rotateY, 
            z,
            transformStyle: "preserve-3d",
          }}
          className="relative"
        >
          {/* Main card */}
          <div className="relative glass-royal rounded-2xl overflow-hidden border border-gold-500/20">
            {/* Map preview with parallax layers */}
            <div className="relative h-48 overflow-hidden">
              {/* Background layer - roads */}
              <motion.div 
                className="absolute inset-0 bg-royal-900"
                style={{ 
                  backgroundImage: `
                    linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px)
                  `,
                  backgroundRepeat: "repeat",
                  transform: "translateZ(-20px)",
                }}
              />
              
              {/* Mid layer - buildings */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: "translateZ(10px)" }}
              >
                {/* Stylized map elements */}
                <div className="relative w-full h-full">
                  {/* Roads */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gold-500/20" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gold-500/20" />
                  <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gold-500/10" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-gold-500/10" />
                  <div className="absolute top-0 bottom-0 right-1/4 w-0.5 bg-gold-500/10" />
                  
                  {/* Building blocks */}
                  {[
                    { x: "15%", y: "20%", w: "20%", h: "25%" },
                    { x: "60%", y: "15%", w: "15%", h: "20%" },
                    { x: "10%", y: "60%", w: "25%", h: "30%" },
                    { x: "70%", y: "55%", w: "20%", h: "35%" },
                    { x: "40%", y: "70%", w: "15%", h: "20%" },
                  ].map((block, i) => (
                    <motion.div
                      key={i}
                      className="absolute bg-royal-800/50 rounded-sm border border-gold-500/10"
                      style={{ 
                        left: block.x, 
                        top: block.y, 
                        width: block.w, 
                        height: block.h,
                        transform: `translateZ(${5 + i * 2}px)`,
                      }}
                      animate={{
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Pin marker - top layer */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full"
                style={{ transform: "translateZ(40px)" }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="relative">
                  {/* Pin glow */}
                  <motion.div
                    className="absolute inset-0 blur-xl bg-gold-500/50 rounded-full scale-150"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Pin */}
                  <div className="relative w-12 h-12 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-2xl border-2 border-gold-300">
                    <MapPin className="w-6 h-6 text-royal-950" />
                  </div>
                  
                  {/* Pin shadow */}
                  <motion.div
                    className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Pulse rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 border border-gold-500/30 rounded-full"
                    animate={{
                      scale: [1, 2.5, 2.5],
                      opacity: [0.5, 0, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: i * 0.8,
                    }}
                  />
                ))}
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-transparent to-royal-950/50" />
            </div>

            {/* Info section */}
            <div className="p-5">
              <h3 className="font-decorative text-xl text-gold-100 mb-2">{venue}</h3>
              <p className="text-sm text-gold-500/60 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: address }} />
              
              <div className="flex items-center gap-4 text-xs text-gold-500/50">
                <div className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  <span>15 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation className="w-4 h-4" />
                  <span>Ver ruta</span>
                </div>
              </div>
            </div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, transparent 100%)",
              }}
            />
          </div>

          {/* 3D shadow */}
          <div 
            className="absolute -bottom-4 left-4 right-4 h-8 bg-black/20 blur-xl rounded-full"
            style={{ transform: "translateZ(-30px) rotateX(90deg)" }}
          />
        </motion.div>

        {/* Hover instruction */}
        <motion.p
          className="text-center text-xs text-gold-500/40 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {isMobile ? "" : "Haz clic para ampliar."}
        </motion.p>
      </motion.div>

      {/* Expanded modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsExpanded(false)}
          >
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center hover:bg-gold-500/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-gold-400" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-royal rounded-2xl overflow-hidden border border-gold-500/20">
                {/* Map iframe */}
                <div className="relative h-80 md:h-96">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${coordinates.lat},${coordinates.lng}&zoom=15`}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-decorative text-2xl text-gold-100 mb-2">{venue}</h3>
                  <p className="text-sm text-gold-500/60 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: address }} />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <AnimatedButton onClick={() => window.open(mapUrl, "_blank")}>
                      <Navigation className="w-4 h-4" />
                      Abrir en Google Maps
                      <ExternalLink className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
