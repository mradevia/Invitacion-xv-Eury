"use client"

import React from "react"

import { memo, useRef, useCallback } from "react"
import { motion, useInView, useScroll, useTransform, useReducedMotion, useMotionValue, useSpring } from "framer-motion"
import { ArrowRight, MapPin, Church, PartyPopper } from "lucide-react"
import Image from "next/image"
import { AnimatedButton } from "../animated-button"
import { LocationMap3D } from "../location-map-3d"

interface EventCardProps {
  title: string
  subtitle: string
  venue: string
  address: string
  time: string
  image: string
  mapUrl: string
  coordinates: { lat: number; lng: number }
  reverse?: boolean
  accentColor: "fire" | "gold"
  icon: React.ReactNode
}

const EventCard = memo(function EventCard({
  title,
  subtitle,
  venue,
  address,
  time,
  image,
  mapUrl,
  coordinates,
  reverse = false,
  accentColor,
  icon,
}: EventCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  // 3D tilt for image
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const springConfig = { stiffness: 150, damping: 20 }
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [prefersReducedMotion, mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
    >
      {/* Image with 3D effect */}
      <motion.div
        style={{
          y: prefersReducedMotion ? 0 : y,
          scale: prefersReducedMotion ? 1 : imageScale,
          perspective: "1000px"
        }}
        className={`relative ${reverse ? "lg:order-2" : "lg:order-1"}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
            transformStyle: "preserve-3d"
          }}
          className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl group"
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={80}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA/"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/20 to-transparent" />

          {/* Time badge */}
          <motion.div
            className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 glass-royal px-4 py-3 sm:px-6 sm:py-4 rounded-lg"
            initial={{ x: -20, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="font-decorative text-2xl sm:text-4xl text-gold-400">{time}</span>
          </motion.div>

          {/* Icon badge */}
          <motion.div
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 sm:w-16 sm:h-16 rounded-full glass-royal flex items-center justify-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{ transform: "translateZ(40px)" }}
          >
            {icon}
          </motion.div>

          {/* Border glow */}
          <div className="absolute inset-0 border border-gold-500/0 group-hover:border-gold-500/20 transition-colors duration-500 rounded-xl" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className={`${reverse ? "lg:order-1 lg:text-right" : "lg:order-2"} text-left px-2`}>
        <motion.div
          initial={{ opacity: 0, x: reverse ? 30 : -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex items-center gap-4 mb-4 ${reverse ? "lg:justify-end" : ""}`}
        >
          {!reverse && (
            <motion.div
              className="w-12 sm:w-16 h-px bg-gradient-to-r from-gold-500 to-transparent"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          )}
          <span className="text-gold-500 text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em]">{subtitle}</span>
          {reverse && (
            <motion.div
              className="w-12 sm:w-16 h-px bg-gradient-to-l from-gold-500 to-transparent"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-decorative text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight"
        >
          {title.split(" ")[0]}
          <br />
          <span className={accentColor === "fire" ? "text-fire-500" : "text-gold-400"}>
            {title.split(" ").slice(1).join(" ")}
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          {/* 3D Location Map */}
          <LocationMap3D
            venue={venue}
            address={address}
            coordinates={coordinates}
            mapUrl={mapUrl}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={reverse ? "lg:flex lg:justify-end" : ""}
        >
          <AnimatedButton
            variant="secondary"
            onClick={() => window.open(mapUrl, "_blank")}
          >
            <MapPin className="w-4 h-4" />
            Cómo Llegar
            <ArrowRight className="w-4 h-4" />
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.div>
  )
})

export function EventsSection() {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section
      ref={sectionRef}
      className="min-h-screen py-24 md:py-32 px-4 flex flex-col justify-center gap-24 md:gap-32 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020a18 0%, #0d1a33 50%, #020a18 100%)",
      }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: prefersReducedMotion ? 0 : backgroundY }}
      >
        <div className="absolute top-1/4 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-royal-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-gold-500/5 rounded-full blur-[100px]" />
      </motion.div>

      <EventCard
        title="Ceremonia Religiosa"
        subtitle="Momento Sagrado"
        venue="Quinta Las Aguilas"
        address="Calle La Garita 12, Coacalco,<br/>55700 San Francisco Coacalco, Méx."
        time="7:15 PM"
        image="/images/ceremonia-religiosa.png"
        mapUrl="https://www.google.com/maps/search/?api=1&query=Quinta+Las+Aguilas+Coacalco"
        coordinates={{ lat: 19.6294, lng: -99.1106 }}
        accentColor="fire"
        icon={<Church className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" />}
      />

      <EventCard
        title="Gran Recepción"
        subtitle="Festejo Real"
        venue="Quinta Las Aguilas"
        address="Calle La Garita 12, Coacalco,<br/>55700 San Francisco Coacalco, Méx."
        time="8:30 PM"
        image="/images/gran-recepcion.png"
        mapUrl="https://www.google.com/maps/search/?api=1&query=Quinta+Las+Aguilas+Coacalco"
        coordinates={{ lat: 19.6294, lng: -99.1106 }}
        reverse
        accentColor="gold"
        icon={<PartyPopper className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400" />}
      />
    </section>
  )
}
