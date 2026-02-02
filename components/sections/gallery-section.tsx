"use client"

import React from "react"

import { motion, useInView, useScroll, useTransform, AnimatePresence, useReducedMotion } from "framer-motion"
import { useRef, useState, useCallback, useEffect, memo } from "react"
import { GalleryHorizontal, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import Image from "next/image"
import { MagicSparkle } from "../magic-sparkles"
import { VelocityText } from "../scroll-animations"

const galleryImages = [
  {
    src: "/images/img-2.jpg",
    title: "La Princesa",
  },
  {
    src: "/images/heroe1.jpg",
    title: "Reino de Fantasía",
    featured: true,
  },
  {
    src: "/images/img-2.jpg",
    title: "Elegancia Eterna",
  },
]

const GalleryImage = memo(function GalleryImage({
  img,
  index,
  isInView,
  hoveredIndex,
  setHoveredIndex,
  setSelectedImage,
  onTouch
}: {
  img: typeof galleryImages[0]
  index: number
  isInView: boolean
  hoveredIndex: number | null
  setHoveredIndex: (i: number | null) => void
  setSelectedImage: (i: number) => void
  onTouch: (x: number, y: number) => void
}) {
  const prefersReducedMotion = useReducedMotion()
  const isHovered = hoveredIndex === index
  const isFeatured = img.featured
  const cardRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    onTouch(touch.clientX, touch.clientY)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
      className={`relative ${isFeatured ? "md:-mt-8 md:mb-8 z-10" : ""}`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onTouchStart={handleTouchStart}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className={`relative overflow-hidden rounded-xl cursor-pointer ${isFeatured ? "h-[400px] sm:h-[500px] md:h-[600px]" : "h-[350px] sm:h-[400px] md:h-[500px]"
          }`}
        onClick={() => setSelectedImage(index)}
        whileHover={prefersReducedMotion ? {} : {
          scale: 1.03,
          rotateY: index === 1 ? 0 : index === 0 ? 4 : -4,
          z: 50
        }}
        whileTap={{ scale: 0.97 }}
        style={{
          boxShadow: isHovered
            ? "0 35px 70px rgba(0,0,0,0.6), 0 0 50px rgba(212, 175, 55, 0.2), inset 0 0 40px rgba(212, 175, 55, 0.1)"
            : "0 15px 35px rgba(0,0,0,0.4)",
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src={img.src || "/placeholder.svg"}
          alt={img.title}
          fill
          className="object-cover transition-all duration-700"
          style={{
            filter: isHovered ? "grayscale(0) brightness(1.1) saturate(1.2)" : "grayscale(0.1)",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={85}
          loading={index === 1 ? "eager" : "lazy"}
          priority={index === 1}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA/"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/10 to-transparent" />

        {/* Animated shine border - FIXED: removed conflicting background properties */}
        {isHovered && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              border: "2px solid transparent",
              borderImage: "linear-gradient(45deg, transparent 40%, rgba(212, 175, 55, 0.6) 50%, transparent 60%) 1",
            }}
          />
        )}

        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 30, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={isHovered && !prefersReducedMotion ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-gold-400" />
            </motion.div>
            <span className="text-gold-400 text-sm uppercase tracking-widest font-semibold">Ver foto</span>
          </div>
          <h3 className="font-decorative text-2xl text-white drop-shadow-lg">{img.title}</h3>
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: isHovered
              ? "inset 0 0 0 3px rgba(212, 175, 55, 0.5)"
              : "inset 0 0 0 1px rgba(212, 175, 55, 0.15)",
          }}
          transition={{ duration: 0.3 }}
        />

        {isHovered && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                willChange: "transform",
              }}
            />

            {/* Sparkle particles on hover - reduced on mobile */}
            {typeof window !== 'undefined' && window.innerWidth > 768 && [0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gold-400 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  willChange: "transform, opacity",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  y: [0, -30]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  )
})

export function GallerySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [touchSparkles, setTouchSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const titleY = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const handleTouch = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random()
    setTouchSparkles(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setTouchSparkles(prev => prev.filter(f => f.id !== id))
    }, 1000)
  }, [])

  const navigateImage = useCallback((direction: "prev" | "next") => {
    if (selectedImage === null) return
    if (direction === "prev") {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1)
    }
  }, [selectedImage])

  useEffect(() => {
    if (selectedImage === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigateImage("prev")
      if (e.key === "ArrowRight") navigateImage("next")
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, navigateImage])

  return (
    <section
      ref={ref}
      className="min-h-screen py-24 md:py-32 px-4 relative flex flex-col items-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020a18 0%, #060d1a 50%, #020a18 100%)",
      }}
    >
      {touchSparkles.map(sparkle => (
        <MagicSparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
      ))}

      {/* Separator Text */}
      <div className="absolute top-0 left-0 w-full py-6 border-y border-gold-500/10 bg-royal-950/30 backdrop-blur-sm z-20">
        <VelocityText baseVelocity={1.5} className="text-2xl md:text-3xl font-decorative text-gold-500/20">
          MOMENTOS MÁGICOS • EURYTHMI • MIS XV AÑOS • 22 DE MAYO •
        </VelocityText>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: prefersReducedMotion ? 0 : backgroundY }}
      >
        <div className="absolute top-1/3 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-royal-500/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] md:w-[600px] h-[350px] md:h-[600px] bg-gold-500/8 rounded-full blur-[120px]" />
      </motion.div>

      <motion.div
        style={{ y: prefersReducedMotion ? 0 : titleY, opacity: titleOpacity }}
        className="text-center mb-12 md:mb-20 relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full border-2 border-gold-500/40 flex items-center justify-center relative"
        >
          <motion.div
            className="absolute inset-0 bg-gold-500/10 rounded-full blur-xl"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <GalleryHorizontal className="w-8 h-8 md:w-10 md:h-10 text-gold-500" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="font-decorative text-4xl md:text-5xl lg:text-7xl text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Galería
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4"
        />

        <motion.p
          className="font-serif text-gold-500/60 text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          Momentos Inolvidables
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">
        {galleryImages.map((img, index) => (
          <GalleryImage
            key={img.title}
            img={img}
            index={index}
            isInView={isInView}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            setSelectedImage={setSelectedImage}
            onTouch={handleTouch}
          />
        ))}
      </div>

      {/* Bottom Separator Text */}
      <div className="absolute bottom-0 left-0 w-full py-6 border-y border-gold-500/10 bg-royal-950/30 backdrop-blur-sm z-20">
        <VelocityText baseVelocity={-1.5} className="text-2xl md:text-3xl font-decorative text-gold-500/20">
          MOMENTOS MÁGICOS • EURYTHMI • MIS XV AÑOS • 22 DE MAYO •
        </VelocityText>
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gold-500/40 flex items-center justify-center hover:bg-gold-500/20 transition-colors z-10 backdrop-blur-sm bg-transparent"
              whileHover={{ scale: 1.1, borderColor: "rgba(212, 175, 55, 0.8)", rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -20, rotate: -180 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: 0.2 }}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-gold-400" />
            </motion.button>

            <motion.button
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gold-500/40 flex items-center justify-center hover:bg-gold-500/20 transition-colors z-10 backdrop-blur-sm bg-transparent"
              whileHover={{ scale: 1.15, x: -8, borderColor: "rgba(212, 175, 55, 0.8)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); navigateImage("prev") }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gold-400" />
            </motion.button>

            <motion.button
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-gold-500/40 flex items-center justify-center hover:bg-gold-500/20 transition-colors z-10 backdrop-blur-sm bg-transparent"
              whileHover={{ scale: 1.15, x: 8, borderColor: "rgba(212, 175, 55, 0.8)" }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); navigateImage("next") }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gold-400" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotateY: -20 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotateY: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-5xl h-[70vh] md:h-[80vh]"
              onClick={(e) => e.stopPropagation()}
              style={{ perspective: "1500px" }}
            >
              <Image
                src={galleryImages[selectedImage].src || "/placeholder.svg"}
                alt={galleryImages[selectedImage].title}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="100vw"
                quality={90}
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA/"
              />

              <motion.div
                className="absolute -bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 glass-royal px-8 py-4 md:px-10 md:py-5 rounded-full border border-gold-500/30"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="font-decorative text-xl md:text-2xl text-gold-100">
                  {galleryImages[selectedImage].title}
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {galleryImages.map((_, i) => (
                <motion.button
                  key={i}
                  className={`h-2 rounded-full transition-all bg-transparent ${i === selectedImage ? "bg-gold-400 w-8" : "bg-gold-500/40 w-2"
                    }`}
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(i) }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Ver imagen ${i + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
